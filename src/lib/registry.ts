import type { CollectionDocumentType, Language, StaticDocumentType } from '@root/sanity/sanity.types';

type DocumentId = string;

type RegistryEntry = {
    [lang in Language]?: {
        type: CollectionDocumentType | StaticDocumentType;
        slug: string;
        route: string;
        title: string;
    };
};

const idRegistry = new Map<DocumentId, RegistryEntry>();

export const registerId = (
    id: DocumentId,
    lang: Language,
    type: CollectionDocumentType | StaticDocumentType,
    slug: string,
    route: string,
    title: string,
) => {
    const existing = idRegistry.get(id) ?? {};
    existing[lang] = {
        type: type,
        slug: slug,
        route: route,
        title: title,
    };
    idRegistry.set(id, existing);
};

export const getFromRegistry = (id: DocumentId | undefined): RegistryEntry | undefined => {
    if (!id) return undefined;
    return idRegistry.get(id) ?? undefined;
};