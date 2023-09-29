import React from 'react';

import {useTranslation} from 'next-i18next';

import CopyIcon from '@Components/Common/Icons/Copy';
import Pro from '@Components/Common/Icons/Pro';
import AppButton from '@Components/Common/Input/Button/AppButton';
import {ButtonVariant} from '@Components/Common/Input/Button/AppButtonProps';
import {Tooltip} from '@mui/material';
import {toast} from 'react-toastify';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

import environments from '@app/configs/environments';
import {customize} from '@app/constants/locales/customize';
import {toastMessage} from '@app/constants/locales/toast-message';
import {toolTipConstant} from '@app/constants/locales/tooltip';
import {updateWorkspace} from '@app/constants/locales/update-workspace';
import {selectIsAdmin, selectIsProPlan} from '@app/store/auth/slice';
import {selectForm} from '@app/store/forms/slice';
import {useAppSelector} from '@app/store/hooks';
import {selectWorkspace} from '@app/store/workspaces/slice';

import BetterInput from '../Common/input';
import {useModal} from '../modal-views/context';
import Button from './button';
import Globe from "@app/components/icons/flags/globe";
import AppTextField from "@Components/Common/Input/AppTextField";
import ProPlanHoc from "@app/components/hoc/pro-plan-hoc";
import {useFullScreenModal} from "@app/components/modal-views/full-screen-modal-context";

interface ICurrentLinkUpdate {
    isCustomDomain?: boolean;
    link: string;
    isDisable?: boolean;
    isProUser?: boolean;
}

export default function FormLinkUpdateView({
                                               link,
                                               isCustomDomain = false,
                                               isDisable = false,
                                               isProUser
                                           }: ICurrentLinkUpdate) {
    const {openModal: openFullScreenModal} = useFullScreenModal();
    const {openModal} = useModal();
    const [_, copyToClipboard] = useCopyToClipboard();
    const form = useAppSelector(selectForm);
    const workspace = useAppSelector(selectWorkspace);
    const {t} = useTranslation();

    const handleOnClickCustomDomain = () => {
        if (isProUser) {
            openModal('UPDATE_WORKSPACE_DOMAIN', {customSlug: form?.settings?.customUrl});
        } else {
            openFullScreenModal("UPGRADE_TO_PRO");
        }
    }

    const handleOnCopy = () => {
        copyToClipboard(link);
        toast(t(toastMessage.copied).toString(), {
            type: 'info'
        });
    }

    return (
        <div className="flex relative space-between items-end w-full">
            <div className="flex-1">
                <div
                    className="body6 mb-2 !font-semibold">{isCustomDomain ? 'Custom Domain Link' : 'Default Link'}</div>
                <div className="flex flex-col items-start gap-2 w-full flex-1">
                    <AppTextField isDisabled={true} className={"w-full"}
                                  onClick={handleOnCopy}
                                  value={link}/>
                    <div className="flex flex-row gap-4 items-center w-full">
                        <AppButton
                            variant={ButtonVariant.Secondary}
                            onClick={handleOnCopy}
                            icon={<CopyIcon className='cursor-pointer'/>}
                        >
                            Copy Link
                        </AppButton>
                        {!isCustomDomain && <AppButton variant={ButtonVariant.Tertiary} icon={
                            <Globe className="h-[18px] w-[18px]"/>
                        }
                                                       disabled={isDisable}
                                                       onClick={
                                                           handleOnClickCustomDomain
                                                       }>
                            {/* {t(updateWorkspace.common.change)} */}
                            Use Custom Domain
                        </AppButton>}
                    </div>
                </div>
            </div>
        </div>
    );
}
