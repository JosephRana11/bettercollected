/**
 * Created By: Rupan Chaulagain
 * Date: 2022-10-11
 * Time: 14:40
 * Project: formintegratorwebapp
 * Organization: Sireto Technology
 */
import getConfig from 'next/config';

const config = getConfig();
let publicRuntimeConfig: any = {};
if (config && config.publicRuntimeConfig) {
    publicRuntimeConfig = config.publicRuntimeConfig;
}

const IS_IN_PRODUCTION_MODE = publicRuntimeConfig.NEXT_PUBLIC_NODE_ENV === 'production';

const environments = {
    // build-time configs
    BASE_DEPLOY_PATH: process.env.BASE_DEPLOY_PATH ?? '',

    // run-time configs
    CONTACT_US_URL: publicRuntimeConfig.CONTACT_US_URL,
    GA_MEASUREMENT_ID: publicRuntimeConfig.GA_MEASUREMENT_ID,
    WAITLIST_FORM_URL: publicRuntimeConfig.WAITLIST_FORM_URL,
    INDIVIDUAL_FORM_URL: publicRuntimeConfig.INDIVIDUAL_FORM_URL,
    BUSINESS_FORM_URL: publicRuntimeConfig.BUSINESS_FORM_URL,
    ENTERPRISE_FORM_URL: publicRuntimeConfig.ENTERPRISE_FORM_URL,

    // internal configs
    IS_IN_PRODUCTION_MODE
};

export default environments;
