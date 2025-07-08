import type { AnyTargetableDocumentStub, CollectionDocument, CollectionDocumentType, Language } from '@root/sanity/sanity.types';
import { getSlug } from '@lib/contentUtils';

export const LOCALE_PREFIXES: Record<Language, string> = {
    ar: 'ar',
    en: 'en',
};

type LocalisedDocumentCollectionPathRecord<T> = {
    [L in Language]: T;
};
type DocumentCollectionPathDictionary = {
  [K in CollectionDocumentType]: LocalisedDocumentCollectionPathRecord<string>;
};

export const DOCUMENT_COLLECTION_PATHS: DocumentCollectionPathDictionary = {
    project: {
        ar: 'masharih',
        en: 'projects',
    },
    writing: {
        ar: 'kitabat',
        en: 'writings',
    },
    happening: {
        ar: 'baramij',
        en: 'happenings',
    },
    resource: {
        ar: 'mawarid',
        en: 'resources',
    },
};

const isCollectionDocument = (doc: AnyTargetableDocumentStub): doc is CollectionDocument => {
    return doc._type in DOCUMENT_COLLECTION_PATHS;
};

export const generateRoute = (
    doc: AnyTargetableDocumentStub | undefined,
    lang: Language | undefined,
): string | undefined => {
    if (!doc || !lang) return undefined;
    const localePath = LOCALE_PREFIXES[lang];
    const slug = getSlug(doc, lang);
    if (!slug) return undefined;
    if (isCollectionDocument(doc)) {
        const collectionPath: string = DOCUMENT_COLLECTION_PATHS[doc._type][lang];
        return `/${localePath}/${collectionPath}/${slug}`;
    } else {
        return `/${localePath}/${slug}`;
    }
};