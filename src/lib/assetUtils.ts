import { getFileAsset, type SanityFileSource } from '@sanity/asset-utils';
import { SANITY_PROJECT_DATASET, SANITY_PROJECT_ID } from '@root/sanity/sanity.cli';

export const getFile = (source: SanityFileSource) => getFileAsset(source, {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_PROJECT_DATASET,
});