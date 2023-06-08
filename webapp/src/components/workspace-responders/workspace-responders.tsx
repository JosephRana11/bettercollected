import React, { useState } from 'react';

import { useTranslation } from 'next-i18next';

import MenuDropdown from '@Components/Common/Navigation/MenuDropdown/MenuDropdown';
import StyledPagination from '@Components/Common/Pagination';
import SearchInput from '@Components/Common/Search/SearchInput';
import { CheckCircle } from '@mui/icons-material';
import { MenuItem, Typography } from '@mui/material';
import DataTable from 'react-data-table-component';

import { dataTableCustomStyles } from '@app/components/datatable/form/datatable-styles';
import { Close } from '@app/components/icons/close';
import { Plus } from '@app/components/icons/plus';
import { useModal } from '@app/components/modal-views/context';
import EmptyResponse from '@app/components/ui/empty-response';
import Loader from '@app/components/ui/loader';
import globalConstants from '@app/constants/global';
import { formConstant } from '@app/constants/locales/form';
import { groupConstant } from '@app/constants/locales/group';
import { workspaceConstant } from '@app/constants/locales/workspace';
import { useGroupMember } from '@app/lib/hooks/use-group-members';
import { WorkspaceResponderDto } from '@app/models/dtos/form';
import { ResponderGroupDto } from '@app/models/dtos/groups';
import { WorkspaceDto } from '@app/models/dtos/workspaceDto';
import { useGetAllRespondersGroupQuery, useGetWorkspaceRespondersQuery } from '@app/store/workspaces/api';
import { IGetAllSubmissionsQuery } from '@app/store/workspaces/types';
import { isEmailInGroup } from '@app/utils/groupUtils';

export default function WorkspaceResponses({ workspace }: { workspace: WorkspaceDto }) {
    const [query, setQuery] = useState<IGetAllSubmissionsQuery>({
        workspaceId: workspace.id,
        page: 1,
        size: globalConstants.pageSize
    });
    const { addMemberOnGroup, removeMemberFromGroup } = useGroupMember();
    const { data, isLoading, isError } = useGetWorkspaceRespondersQuery(query);
    const responderGroupsQuery = useGetAllRespondersGroupQuery(workspace.id);

    const { openModal } = useModal();
    const { t } = useTranslation();

    const handlePageChange = (e: any, page: number) => {
        setQuery({ ...query, page: page });
    };

    const AddButton = (onClick: () => void) => (
        <div onClick={onClick} className="flex gap-1 items-center cursor-pointer text-black-600">
            <Plus className="h-4 w-4 " />
            <p className="body5 !text-black-600">Add</p>
        </div>
    );
    const ShowResponderGroups = (email: string) => (
        <div className="flex flex-col gap-1">
            {responderGroupsQuery.data?.map((group: ResponderGroupDto) => {
                if (group.emails.includes(email))
                    return (
                        <div key={group.id} className="p-1 w-fit rounded flex items-center gap-2 leading-none bg-brand-200 body5 !text-brand-500">
                            <span className="body5 text-black-8000">{group.name}</span>
                            <Close className="h-2 w-2 cursor-pointer" onClick={() => openModal('DELETE_CONFIRMATION', { title: group.name, handleDelete: () => removeMemberFromGroup({ email, group, workspaceId: workspace.id }) })} />
                        </div>
                    );
                return null;
            })}
            {responderGroupsQuery.data?.length === 0 && AddButton(() => openModal('CREATE_GROUP', { email: email }))}
            {responderGroupsQuery.data?.length > 0 && (
                <MenuDropdown showExpandMore={false} className="cursor-pointer" width={180} id="group-option" menuTitle={''} menuContent={AddButton(() => {})}>
                    {responderGroupsQuery.data?.map((group: ResponderGroupDto) => (
                        <MenuItem disabled={!!isEmailInGroup(group, email)} onClick={() => addMemberOnGroup({ email, group, workspaceId: workspace.id })} key={group.id} className="flex justify-between py-3 hover:bg-black-200">
                            <Typography className="body4" noWrap>
                                {group.name}
                            </Typography>
                            {!!isEmailInGroup(group, email) && <CheckCircle className="h-5 w-5 text-brand-500" />}
                        </MenuItem>
                    ))}
                </MenuDropdown>
            )}
        </div>
    );

    const dataTableResponseColumns: any = [
        {
            name: t(formConstant.responder),
            selector: (responder: WorkspaceResponderDto) => responder.email,
            grow: 2,
            style: {
                color: '#202124',
                fontSize: '14px',
                fontWeight: 500,
                paddingLeft: '16px',
                paddingRight: '16px'
            }
        },
        {
            name: t(formConstant.responses),
            selector: (responder: WorkspaceResponderDto) => responder.responses,
            style: {
                color: 'rgba(0,0,0,.54)',
                paddingLeft: '16px',
                paddingRight: '16px'
            }
        },
        {
            name: t(formConstant.deletionRequests),
            selector: (responder: WorkspaceResponderDto) => responder.deletionRequests,
            style: {
                color: 'rgba(0,0,0,.54)',
                paddingLeft: '16px',
                paddingRight: '16px'
            }
        },
        {
            name: t(groupConstant.default),
            selector: (responder: WorkspaceResponderDto) => ShowResponderGroups(responder.email),
            style: {
                color: 'rgba(0,0,0,.54)',
                paddingLeft: '16px',
                paddingRight: '16px'
            }
        }
    ];

    const handleSearch = (event: any) => {
        if (event.target.value) setQuery({ ...query, email: event.target.value });
        else {
            const { email, ...removedQuery } = query;
            setQuery(removedQuery);
        }
    };

    const Response = () => {
        if (data?.items && data?.items.length > 0)
            return (
                <>
                    <DataTable className="p-0 mt-4 !overflow-auto" columns={dataTableResponseColumns} data={data?.items || []} customStyles={dataTableCustomStyles} highlightOnHover={false} pointerOnHover={false} />
                    {Array.isArray(data?.items) && data?.total > globalConstants.pageSize && (
                        <div className="mt-8 flex justify-center">
                            <StyledPagination shape="rounded" count={data?.pages || 0} page={query.page || 1} onChange={handlePageChange} />
                        </div>
                    )}
                </>
            );
        return <EmptyResponse title={t(formConstant.empty.response.title)} description={t(formConstant.empty.response.description)} />;
    };

    if (isLoading && responderGroupsQuery.isLoading) {
        return (
            <div className=" w-full py-10 flex justify-center">
                <Loader />
            </div>
        );
    }
    return (
        <>
            <p>
                {t(workspaceConstant.allResponders)} {data && ' (' + data.total + ')'}{' '}
            </p>
            <div className="w-full md:w-[282px] mt-6">
                <SearchInput handleSearch={handleSearch} />
            </div>
            {Response()}
        </>
    );
}
