import type { Language, TargetableDocumentType } from '@root/sanity/sanity.types';

export const LOCALE_PREFIXES: Record<Language, string> = {
    ar: 'ar',
    en: 'en',
};

export const DOCUMENT_TYPE_PATHS: Record<TargetableDocumentType, string> = {
    project: 'projects',
    writing: 'writings',
    happening: 'happenings',
    resource: 'resources',
};

export interface GenerateRouteOptions {
    locale: Language;
    documentType: TargetableDocumentType;
    slug?: string;
}

export const generateRoute = ({
    locale,
    documentType,
    slug,
}: GenerateRouteOptions): string => {
    const documentTypePath = DOCUMENT_TYPE_PATHS[documentType];
    const localePrefix = LOCALE_PREFIXES[locale];
    return slug
        ? `/${localePrefix}/${documentTypePath}/${slug}`
        : `/${localePrefix}/${documentTypePath}`;
};