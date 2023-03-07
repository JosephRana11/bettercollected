"""Application configuration - FastAPI."""
import os

from dotenv import load_dotenv
from pydantic import BaseSettings

from googleform.config.database import MongoSettings
from googleform.version import __version__

from pathlib import Path


default_dot_env_path = (
    Path(os.path.abspath(os.path.dirname(__file__)))
    .parent.parent.absolute()
    .joinpath(".env")
)
load_dotenv(os.getenv("DOTENV_PATH", default_dot_env_path))


class Application(BaseSettings):
    """Define application configuration model.

    Constructor will attempt to determine the values of any fields not passed
    as keyword arguments by reading from the environment. Default values will
    still be used if the matching environment variable is not set.

    Environment variables:
        * FASTAPI_DEBUG
        * FASTAPI_PROJECT_NAME
        * FASTAPI_VERSION
        * FASTAPI_DOCS_URL
        * FASTAPI_USE_REDIS

    Attributes:
        DEBUG (bool): FastAPI logging level. You should disable this for
            production.
        PROJECT_NAME (str): FastAPI project name.
        VERSION (str): Application version.
        DOCS_URL (str): Path where swagger ui will be served at.
        USE_REDIS (bool): Whether or not to use Redis.

    """

    DEBUG: bool = True
    PROJECT_NAME: str = "googleform"
    VERSION: str = __version__
    USE_REDIS: bool = False

    API_ROOT_PATH: str = "/api/v1"

    AUTH_JWT_SECRET: str

    GOOGLE_CLIENT_TYPE = "web"
    GOOGLE_CLIENT_ID = ""
    GOOGLE_PROJECT_ID = ""
    GOOGLE_AUTH_URI = ""
    GOOGLE_TOKEN_URI = ""
    GOOGLE_AUTH_PROVIDER_X509_CERT_URL = ""
    GOOGLE_CLIENT_SECRET = ""
    GOOGLE_REDIRECT_URIS = ""
    GOOGLE_JAVASCRIPT_ORIGINS = ""
    GOOGLE_SCOPES = ""
    GOOGLE_API_SERVICE_NAME = "drive"
    GOOGLE_API_VERSION = "v2"
    GOOGLE_REVOKE_CREDENTIALS_URL = ""
    GOOGLE_AES_KEY = ""

    mongo_settings: MongoSettings = MongoSettings()

    # All your additional application configuration should go either here or in
    # separate file in this submodule.

    class Config:
        """Config sub-class needed to customize BaseSettings settings.

        Attributes:
            case_sensitive (bool): When case_sensitive is True, the environment
                variable names must match field names (optionally with a prefix)
            env_prefix (str): The prefix for environment variable.

        Resources:
            https://pydantic-docs.helpmanual.io/usage/settings/

        """

        case_sensitive = True


settings = Application()
