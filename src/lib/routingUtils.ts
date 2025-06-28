import type { CollectionDocument, CollectionDocumentType, Language, StaticDocument } from '@root/sanity/sanity.types';
import { getSlug } from './contentUtils';

export const LOCALE_PREFIXES: Record<Language, string> = {
    ar: 'ar',
    en: 'en',
};

export const DOCUMENT_COLLECTION_PATHS: Record<CollectionDocumentType, string> = {
    project: 'projects',
    writing: 'writings',
    happening: 'happenings',
    resource: 'resources',
};

const isCollectionDocument = (doc: CollectionDocument | StaticDocument): doc is CollectionDocument => {
    return doc._type in DOCUMENT_COLLECTION_PATHS;
};

export const generateRoute = (
    doc: CollectionDocument | StaticDocument,
    lang: Language,
) => {
    const localePath = LOCALE_PREFIXES[lang];
    const slug = getSlug(doc, lang);
    if (isCollectionDocument(doc)) {
        const collectionPath = DOCUMENT_COLLECTION_PATHS[doc._type];
        return `/${localePath}/${collectionPath}/${slug}`;
    } else {
        return `/${localePath}/${slug}`;
    }
};