import type { CollectionDocument, CollectionDocumentStub, CollectionDocumentType, Language, StaticDocument, StaticDocumentStub } from '@root/sanity/sanity.types';
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

const isCollectionDocument = (doc: CollectionDocumentStub | CollectionDocument | StaticDocumentStub | StaticDocument): doc is CollectionDocument => {
    return doc._type in DOCUMENT_COLLECTION_PATHS;
};

export const generateRoute = (
    doc: CollectionDocumentStub | CollectionDocument | StaticDocument | StaticDocumentStub,
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