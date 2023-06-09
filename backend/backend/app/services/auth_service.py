import json
from http import HTTPStatus
from typing import Tuple

from starlette.requests import Request

from backend.app.exceptions import HTTPException
from backend.app.services import workspace_service as workspaces_service
from backend.app.services.form_plugin_provider_service import FormPluginProviderService
from backend.app.services.plugin_proxy_service import PluginProxyService
from backend.app.services.workspace_service import WorkspaceService
from backend.app.utils import AiohttpClient
from backend.config import settings
from common.configs.crypto import Crypto
from common.enums.roles import Roles
from common.models.user import OAuthState, User, UserInfo, UserLoginWithOTP
from common.services.http_client import HttpClient
from common.services.jwt_service import JwtService

crypto = Crypto(settings.auth_settings.AES_HEX_KEY)


class AuthService:
    def __init__(
        self,
        http_client: HttpClient,
        plugin_proxy_service: PluginProxyService,
        form_provider_service: FormPluginProviderService,
        jwt_service: JwtService,
        workspace_service: WorkspaceService,
    ):
        self.http_client = http_client
        self.plugin_proxy_service = plugin_proxy_service
        self.form_provider_service = form_provider_service
        self.jwt_service = jwt_service
        self.workspace_service = workspace_service

    async def get_user_status(self, user: User):
        response_data = await self.http_client.get(
            settings.auth_settings.BASE_URL + "/auth/status",
            params={"user_id": user.id},
        )
        return {"user": response_data}

    async def validate_otp(self, login_details: UserLoginWithOTP):
        response_data = await self.http_client.get(
            settings.auth_settings.BASE_URL + "/auth/otp/validate",
            params={"email": login_details.email, "otp_code": login_details.otp_code},
        )
        user = response_data.get("user", None)
        if not user:
            raise HTTPException(HTTPStatus.UNAUTHORIZED, content="Invalid Otp Code")
        return User(**user)

    async def get_oauth_url(
        self, provider_name: str, client_referer_url: str, user: User
    ):
        provider_url = await self.form_provider_service.get_provider_url(provider_name)
        oauth_state = OAuthState(
            client_referer_uri=client_referer_url,
        )
        if user is not None and Roles.FORM_CREATOR in user.roles:
            oauth_state.email = user.sub
        state = crypto.encrypt(oauth_state.json())
        authorization_url = f"{provider_url}/{provider_name}/oauth/authorize"
        response_data = await self.http_client.get(
            authorization_url, params={"state": state}, timeout=60
        )
        oauth_url = response_data.get("oauth_url")
        return oauth_url

    async def handle_backend_auth_callback(
        self, *, provider_name: str, state: str, request: Request, user: User = None
    ) -> Tuple[User, OAuthState]:
        provider_config = await self.form_provider_service.get_provider_if_enabled(
            provider_name
        )
        response_data = await self.plugin_proxy_service.pass_request(
            request,
            provider_config.auth_callback_url,
            extra_params={"user_id": user.id},
        )
        user_info = UserInfo(**response_data)

        jwt_token = self.jwt_service.encode(user_info)

        response_data = await self.http_client.get(
            settings.auth_settings.CALLBACK_URI, params={"jwt_token": jwt_token}
        )
        user = User(**response_data)
        await workspaces_service.create_workspace(user)
        decrypted_data = json.loads(crypto.decrypt(state))
        state = OAuthState(**decrypted_data)
        if state.email is not None and user.sub != state.email:
            raise HTTPException(403, "Invalid User Authentication.")
        return user, state

    async def get_basic_auth_url(
        self, provider: str, client_referer_url: str, creator: bool = False
    ):
        response_data = await self.http_client.get(
            settings.auth_settings.BASE_URL + f"/auth/{provider}/basic",
            params={"client_referer_url": client_referer_url, "creator": creator},
        )
        return response_data.get("auth_url")

    async def basic_auth_callback(self, provider: str, code: str, state: str):
        response_data = await self.http_client.get(
            settings.auth_settings.BASE_URL + f"/auth/{provider}/basic/callback",
            params={"code": code, "state": state},
            timeout=120,
        )
        user = response_data.get("user")
        if user and Roles.FORM_CREATOR in user.get("roles"):
            await workspaces_service.create_workspace(User(**user))
        return user, response_data.get("client_referer_url", "")

    async def delete_user(self, user: User):
        # TODO Move deleting user to scheduled job and return with removing cookie only when deleting
        #  the user in auth server and credentials in integrations is a success
        await self.delete_credentials_from_integrations(user=user)
        await self.delete_user_form_auth(user=user)
        await self.workspace_service.delete_workspaces_of_user_with_forms(user=user)

    async def delete_credentials_from_integrations(self, user: User):
        providers = await self.form_provider_service.get_providers(get_all=True)
        for provider in providers:
            await AiohttpClient.get_aiohttp_client().delete(
                await self.form_provider_service.get_provider_url(
                    provider.provider_name
                )
                + f"/{provider.provider_name}"
                + "/oauth/credentials",
                params={"user_id": user.id, "email": user.sub},
                timeout=20000,
            )

    async def delete_user_form_auth(self, user: User):
        await AiohttpClient.get_aiohttp_client().delete(
            settings.auth_settings.BASE_URL + "/users/" + user.id, timeout=20000
        )
