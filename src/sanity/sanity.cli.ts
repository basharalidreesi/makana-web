import { createClient } from '@sanity/client';

const sanityClient = createClient({
    projectId: '33wg2r17',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-05-15',
});

export default sanityClient;