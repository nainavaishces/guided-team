import { IAnalyticsConfig } from '../types/config-types';

/**
 * Analytics configuration
 * Contains configuration for analytics tools used in the application
 */
export const ANALYTICS_CONFIG: IAnalyticsConfig = {
  onetrust: {
    cookieName: 'OptanonConsent',
    activeGroupsVariable: 'OnetrustActiveGroups',
  },
  gtm: {
    scriptUrl: 'https://www.googletagmanager.com/gtm.js',
    ids: {
      production: 'GTM-TCVZ9HT',
      staging: 'GTM-TCVZ9HT', // Same as production, can be updated if different
      development: 'GTM-TCVZ9HT', // Same as production, can be updated if different
    },
  },
  elevar: {
    dataLayerVariable: 'ElevarDataLayer',
  },
  consent: {
    localStorageKey: 'consentSettings',
    requiredParameters: [
      'ad_personalization',
      'ad_storage',
      'ad_user_data',
      'analytics_storage',
      'functionality_storage',
      'personalization_storage',
      'security_storage',
    ],
  },
};
