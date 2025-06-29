import { createClient } from '@sanity/client';

export const SANITY_PROJECT_ID = '33wg2r17';
export const SANITY_PROJECT_DATASET = 'production';

const sanityClient = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_PROJECT_DATASET,
    useCdn: false,
    apiVersion: '2025-05-15',
});

export default sanityClient;