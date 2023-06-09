import datetime as dt
from typing import Dict, Optional, List, Any

from beanie import PydanticObjectId
from fastapi_camelcase import CamelModel

from backend.app.models.dtos.response_group_dto import ResponderGroupDto
from backend.app.models.response_dtos import WorkspaceFormSettingsCamelModal
from common.models.standard_form import StandardFormField


class MinifiedForm(CamelModel):
    form_id: str
    title: Optional[str]
    description: Optional[str]
    type: Optional[str]
    settings: Optional[WorkspaceFormSettingsCamelModal]
    created_at: Optional[dt.datetime]
    published_at: Optional[dt.datetime]
    responses: Optional[int]
    deletion_requests: Optional[int]
    groups: Optional[List[ResponderGroupDto]]
    imported_by: Optional[str]
    importer_details: Optional[Dict]
    fields: Optional[List[StandardFormField]]
