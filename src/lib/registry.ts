import type { AnyTargetableDocumentType, Language } from '@root/sanity/sanity.types';

// The Registry is used as a validation gate
// and a source for multi-language linking.
// A document is only registered when it
// is successfully published (i.e., when it
// passes all the checks in getStaticPaths –
// see @pages/[slug].astro and
// @pages/[locale]/[collection].astro)

type DocumentId = string;

type RegistryEntry = {
    [lang in Language]?: {
        type: AnyTargetableDocumentType;
        slug: string;
        route: string;
        title: string;
    };
};

const idRegistry = new Map<DocumentId, RegistryEntry>();

export const registerId = (
    id: DocumentId,
    lang: Language,
    type: AnyTargetableDocumentType,
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