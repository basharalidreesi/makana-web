import type { CollectionDocument, Language, PageBuilder, Slug, StaticDocument } from '@root/sanity/sanity.types';
import { DEFAULT_LANGUAGE_ID, UI_DICTIONARY } from './languageUtils';

const hasLanguage = (doc: unknown): doc is { language: Language } => {
    return typeof doc === 'object' && doc !== null && 'language' in doc;
};

const hasLocalisedSlug = (
    doc: unknown,
    lang: Language
): doc is { slug: Record<Language, { current: string }> } => {
    return (
        typeof doc === 'object'
        && doc !== null
        && 'slug' in doc
        && typeof (doc as any).slug === 'object'
        && lang in (doc as any).slug
        && typeof (doc as any).slug?.[lang]?.current === 'string'
    );
};

export const groupByLanguageField = (
    docs: (CollectionDocument | StaticDocument)[] = [],
    lang: Language
) => {
    return docs.filter((doc) => hasLanguage(doc) && doc.language === lang);
};

export const groupByLocalisedSlug = (
    docs: (CollectionDocument | StaticDocument)[] = [],
    lang: Language
) => {
    return docs.filter((doc) => hasLocalisedSlug(doc, lang));
};

const getFromLocalisedField = <T>(
    doc: Record<string, any> | undefined,
    field: string,
    lang: Language | undefined,
    fallbackLang: Language = DEFAULT_LANGUAGE_ID,
): T | undefined => {
    if (!doc || !field || !(field in doc)) return undefined;
    const value = doc[field];
    if (!value) return undefined;
    if (Array.isArray(value)) return value as T;
    if (typeof value === 'object') {
        if (lang && lang in value) return value[lang] as T;
        if (fallbackLang && fallbackLang in value) return value[fallbackLang] as T;
    }
    return undefined;
};

export const getSlug = (
    doc: CollectionDocument | StaticDocument,
    lang: Language | undefined
): string | undefined => {
    const slug = doc.slug;
    if (!slug) return undefined;
    if ('current' in slug) return slug.current;
    return getFromLocalisedField<Slug>(doc, 'slug', lang)?.current;
};

export const getTitle = (
    doc: CollectionDocument | StaticDocument,
    lang: Language | undefined
): string | undefined => {
    const fallbackTitle = UI_DICTIONARY.untitled[lang ?? DEFAULT_LANGUAGE_ID]
    const title = doc.title;
    if (!title) return fallbackTitle;
    if (typeof title === 'string') return title;
    return getFromLocalisedField<string>(doc, 'title', lang) ?? fallbackTitle;
};

export const getSummary = (
    doc: CollectionDocument | StaticDocument,
    lang: Language | undefined
): string | undefined => {
    if (!('summary' in doc)) return undefined;
    const summary = doc.summary;
    if (!summary) return undefined;
    if (typeof summary === 'string') return summary;
    return getFromLocalisedField<string>(doc, 'summary', lang);
};

export const getContent = (
    doc: CollectionDocument | StaticDocument,
    lang: Language | undefined
): PageBuilder | undefined => {
    const content = doc.content;
    if (!content) return undefined;
    if (Array.isArray(content)) return content;
    return getFromLocalisedField<PageBuilder>(doc, 'content', lang);
};