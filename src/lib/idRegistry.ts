import type { AnyTargetableDocumentType, Language } from '@root/sanity/sanity.types';

/**
 * The `idRegistry` acts as both a validation mechanism and a central source
 * for resolving multilingual content links.
 * 
 * A document is only registered when it is successfully published –
 * specifically, after it passes all validation checks in `getStaticPaths`.
 * 
 * This registry enables:
 * - Efficient lookups by document ID across languages
 * - Dynamic route resolution for localised content
 * - Safe interlinking between different language versions of a document
 * 
 * For implementation context, see:
 * - @pages/[slug].astro
 * - @pages/[locale]/[collection].astro
 * - @lib/contentUtils.astro
 */

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