export const ClientFeatures = ['customCampaign', 'carousel'] as const;

export type ClientFeatureType = typeof ClientFeatures[number];
