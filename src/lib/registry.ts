import type { CollectionDocumentType, Language, StaticDocumentType } from "@root/sanity/sanity.types";

type RegistryEntry = {
    [lang in Language]?: {
        type: CollectionDocumentType | StaticDocumentType;
        slug: string;
        isLocalised: boolean;
    };
};

type DocumentId = string;

export const idRegistry = new Map<DocumentId, RegistryEntry>();

export const registerId = (
    id: DocumentId,
    lang: Language,
    type: CollectionDocumentType | StaticDocumentType,
    slug: string,
    isLocalised: boolean,
) => {
    const existing = idRegistry.get(id) ?? {};
    existing[lang] = {
        type: type,
        slug: slug,
        isLocalised: isLocalised,
    };
    idRegistry.set(id, existing);
};

export const getSlugFromId = (id: DocumentId | undefined, lang: Language | undefined): string | undefined => {
    if (!id || !lang) return undefined;
    const entry = idRegistry.get(id);
    if (!entry) return undefined;
    return entry[lang]?.slug ?? '';
};

export const getTypeFromId = (id: DocumentId | undefined): (CollectionDocumentType | StaticDocumentType) | undefined => {
    if (!id) return undefined;
    const entry = idRegistry.get(id);
    if (!entry) return undefined;
    for (const lang of Object.keys(entry) as Language[]) {
        const type = entry[lang]?.type;
        if (type) return type;
    }
    return undefined;
};