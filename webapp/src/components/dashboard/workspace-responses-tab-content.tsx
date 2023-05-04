import React from 'react';

import ZeroElement from '@Components/Common/DataDisplay/Empty/ZeroElement';
import Tooltip from '@Components/Common/DataDisplay/Tooltip';

import RequestForDeletionBadge from '@app/components/badge/request-for-deletion-badge';
import EmptyFormsView from '@app/components/dashboard/empty-form';
import ActiveLink from '@app/components/ui/links/active-link';
import Loader from '@app/components/ui/loader';
import environments from '@app/configs/environments';
import { useBreakpoint } from '@app/lib/hooks/use-breakpoint';
import { StandardFormResponseDto } from '@app/models/dtos/form';
import { WorkspaceDto } from '@app/models/dtos/workspaceDto';
import { useGetWorkspaceSubmissionsQuery } from '@app/store/workspaces/api';
import { parseDateStrToDate, toHourMinStr, toMonthDateYearStr } from '@app/utils/dateUtils';
import { toEndDottedStr } from '@app/utils/stringUtils';

interface IWorkspaceResponsesTabContentProps {
    workspace: WorkspaceDto;
    deletionRequests?: boolean;
}

export default function WorkspaceResponsesTabContent({ workspace, deletionRequests = false }: IWorkspaceResponsesTabContentProps) {
    const { isLoading, data, isError } = useGetWorkspaceSubmissionsQuery(
        {
            workspaceId: workspace.id,
            requestedForDeletionOly: deletionRequests
        },
        { pollingInterval: 30000 }
    );
    const breakpoint = useBreakpoint();

    if (isLoading)
        return (
            <div data-testid="loader" className="w-full min-h-[30vh] flex flex-col items-center justify-center text-darkGrey">
                <Loader />
            </div>
        );

    if ((data?.items && Array.isArray(data?.items) && data?.items?.length === 0) || isError)
        return (
            <ZeroElement
                title={deletionRequests ? 'No requests to show' : 'No responses to show'}
                description={deletionRequests ? 'You have not requested any deletion for your filled responses.' : 'You have not submitted any response on the forms provided in this workspace.'}
                className="!pb-[20px]"
            />
        );

    const submissions: Array<StandardFormResponseDto> = data?.items ?? [];

    const isCustomDomain = window?.location.host !== environments.CLIENT_DOMAIN;

    const submissionCard = ({ submission, submittedAt }: any) => (
        <>
            <div key={submission.responseId} className={`w-full overflow-hidden items-center justify-between h-full gap-8 p-5 border-[1px] border-black-400 ${!deletionRequests && 'transition cursor-pointer hover:border-brand-500'} rounded`}>
                <div className="relative flex flex-col justify-start h-full">
                    <p className="text-sm text-gray-400 italic break-all">{['xs'].indexOf(breakpoint) !== -1 ? toEndDottedStr(submission.formId, 30) : submission.formId}</p>
                    <Tooltip title={submission?.formTitle || 'Untitled'}>
                        <p className="body3 !not-italic leading-none">{['xs', '2xs', 'sm', 'md'].indexOf(breakpoint) !== -1 ? toEndDottedStr(submission?.formTitle || 'Untitled', 15) : toEndDottedStr(submission?.formTitle || 'Untitled', 20)}</p>
                    </Tooltip>
                    <div className="w-full flex flex-col lg:flex-row justify-between">
                        <p className="text-xs text-gray-400 italic">
                            <span>Last submitted at {submittedAt}</span>
                        </p>
                        {deletionRequests && submission?.deletionStatus && <RequestForDeletionBadge deletionStatus={submission?.deletionStatus} className="absolute -bottom-4 -right-5" />}
                    </div>
                </div>
            </div>
        </>
    );
    return (
        <div className="py-6 px-5 lg:px-10 xl:px-20">
            {submissions?.length === 0 && <EmptyFormsView description="0 responses" />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {submissions?.length !== 0 &&
                    submissions?.map((submission: StandardFormResponseDto) => {
                        const slug = submission.responseId;
                        const submittedAt = `${toMonthDateYearStr(parseDateStrToDate(submission.updatedAt))} ${toHourMinStr(parseDateStrToDate(submission.updatedAt))}`;
                        return deletionRequests ? (
                            submissionCard({ submission, submittedAt })
                        ) : (
                            <ActiveLink
                                key={submission.responseId}
                                href={{
                                    pathname: deletionRequests ? '' : isCustomDomain ? `/submissions/${slug}` : `${workspace.workspaceName}/submissions/${slug}`
                                }}
                            >
                                {submissionCard({ submission, submittedAt })}
                            </ActiveLink>
                        );
                    })}
            </div>
        </div>
    );
}
