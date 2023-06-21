import React, { useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

import BetterInput from '@app/components/Common/input';
import RegexCard from '@app/components/cards/regex-card';
import BreadcrumbsRenderer from '@app/components/form/renderer/breadcrumbs-renderer';
import GroupInfo from '@app/components/group/group-info';
import GroupMember from '@app/components/group/group-member';
import Back from '@app/components/icons/back';
import { Plus } from '@app/components/icons/plus';
import { useModal } from '@app/components/modal-views/context';
import DashboardLayout from '@app/components/sidebar/dashboard-layout';
import Button from '@app/components/ui/button/button';
import { buttonConstant } from '@app/constants/locales/button';
import { localesCommon } from '@app/constants/locales/common';
import { groupConstant } from '@app/constants/locales/group';
import { members } from '@app/constants/locales/members';
import { placeHolder } from '@app/constants/locales/placeholder';
import { toastMessage } from '@app/constants/locales/toast-message';
import { ToastId } from '@app/constants/toastId';
import { GroupInfoDto } from '@app/models/dtos/groups';
import { WorkspaceDto } from '@app/models/dtos/workspaceDto';
import { BreadcrumbsItem } from '@app/models/props/breadcrumbs-item';
import { useAppSelector } from '@app/store/hooks';
import { useCreateRespondersGroupMutation } from '@app/store/workspaces/api';
import { selectWorkspace } from '@app/store/workspaces/slice';

export default function CreateGroup() {
    const router = useRouter();
    const locale = router?.locale === 'en' ? '' : `${router?.locale}/`;
    const { t } = useTranslation();
    const { closeModal } = useModal();
    const workspace: WorkspaceDto = useAppSelector(selectWorkspace);
    const [groupInfo, setGroupInfo] = useState<GroupInfoDto>({
        name: '',
        description: '',
        email: '',
        emails: []
    });
    const [createResponderGroup, { isLoading }] = useCreateRespondersGroupMutation();
    const handleInput = (event: any) => {
        setGroupInfo({
            ...groupInfo,
            [event.target.id]: event.target.value
        });
    };
    const handleCreateGroup = async () => {
        try {
            await createResponderGroup({
                groupInfo: groupInfo,
                workspace_id: workspace.id
            }).then((response) => {
                if ('data' in response) {
                    toast(t(toastMessage.workspaceSuccess).toString(), { toastId: ToastId.SUCCESS_TOAST, type: 'success' });
                    router.push(`/${workspace?.workspaceName}/dashboard/responders-groups?view=Groups`);
                } else toast(t(toastMessage.somethingWentWrong).toString(), { toastId: ToastId.ERROR_TOAST, type: 'error' });
            });
        } catch (error) {
            toast(t(toastMessage.somethingWentWrong).toString(), { toastId: ToastId.ERROR_TOAST, type: 'error' });
        }
    };

    const breadcrumbsItem: Array<BreadcrumbsItem> = [
        {
            title: t(localesCommon.respondersAndGroups),
            url: `/${locale}${workspace?.workspaceName}/dashboard/responders-groups`
        },
        {
            title: t(groupConstant.groups),
            url: `/${locale}${workspace?.workspaceName}/dashboard/responders-groups?view=Groups`
        },
        {
            title: t(groupConstant.createGroup),
            disabled: true
        }
    ];

    const handleAddMembers = (members: Array<string>) => {
        setGroupInfo({
            ...groupInfo,
            emails: [...groupInfo.emails, ...members]
        });
        closeModal();
    };

    const handleRemoveMember = (email: string) => {
        setGroupInfo({
            ...groupInfo,
            emails: groupInfo.emails.filter((groupInfoEmail) => groupInfoEmail !== email)
        });
    };
    return (
        <DashboardLayout>
            <div className="flex flex-col relative -mt-6 md:max-w-[700px] xl:max-w-[1000px]">
                <div className="absolute top-10 right-0">
                    <Button isLoading={isLoading} disabled={!groupInfo.name || groupInfo.emails.length === 0} onClick={handleCreateGroup}>
                        {t(buttonConstant.saveGroup)}
                    </Button>
                </div>
                <div className="md:max-w-[618px]">
                    <BreadcrumbsRenderer items={breadcrumbsItem} />
                    <div className="flex flex-col gap-10">
                        <div className="flex gap-2  items-center">
                            <Back onClick={() => router.back()} className="cursor-pointer" />
                            <p className="h4">{t(groupConstant.createGroup)}</p>
                        </div>
                        <GroupInfo handleInput={handleInput} groupInfo={groupInfo} />
                        <GroupMember emails={groupInfo.emails} handleAddMembers={handleAddMembers} handleRemoveMember={handleRemoveMember} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
export { getGlobalServerSidePropsByWorkspaceName as getServerSideProps } from '@app/lib/serverSideProps';
