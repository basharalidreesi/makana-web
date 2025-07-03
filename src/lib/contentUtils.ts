import type { CollectionDocument, CollectionDocumentStub, CollectionDocumentType, Language, LocalisedSlug, PageBuilder, Slug, StaticDocument, StaticDocumentStub, StaticDocumentType, TranslationGroup } from '@root/sanity/sanity.types';
import { getSlugFromId, getTypeFromId } from '@lib/registry';
import { DEFAULT_LANGUAGE_ID, UI_DICTIONARY } from '@lib/languageUtils';
import { generateRoute } from './routingUtils';

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

export type Translations = Record<Language, {
    type: CollectionDocumentType | StaticDocumentType;
    slug: Slug;
    route: string;
}>;

export const getTranslations = (
    doc: CollectionDocument | StaticDocument | undefined,
    lang: Language | undefined,
): Partial<Translations> | undefined => {
    if (!doc || !lang) return undefined;
    const translations: Partial<Translations> = {};
    const translationGroup = 'translationGroup' in doc ? (doc.translationGroup as TranslationGroup | undefined) : undefined;
    if (translationGroup?.translations) {
        for (const otherLang of Object.keys(translationGroup.translations) as Language[]) {
            if (otherLang !== lang) {
                const translatedDoc = translationGroup.translations[otherLang];
                const translatedDocId = translatedDoc?._ref;
                const translatedDocType = translatedDocId && getTypeFromId(translatedDocId);
                const translatedDocSlug = translatedDocId && getSlugFromId(translatedDocId, otherLang);
                if (translatedDocType && translatedDocSlug) {
                    const route = generateRoute({ _type: translatedDocType, slug: { _type: 'slug', current: translatedDocSlug } }, otherLang);
                    if (route) {
                        translations[otherLang] = {
                            type: translatedDocType,
                            slug: {
                                _type: 'slug',
                                current: translatedDocSlug,
                            },
                            route: route,
                        };
                    }
                }
            }
        }
    } else {
        if (hasLocalisedSlug(doc, lang)) {
            const localisedSlug = doc.slug as LocalisedSlug;
            for (const otherLang of Object.keys(localisedSlug) as Language[]) {
                if (otherLang !== lang) {
                    const otherSlug = localisedSlug[otherLang]?.current;
                    if (otherSlug) {
                        const route = generateRoute({ _type: doc._type, slug: doc.slug }, otherLang);
                        if (route) {
                            translations[otherLang] = {
                                type: doc._type,
                                slug: {
                                    _type: 'slug',
                                    current: otherSlug,
                                },
                                route: route,
                            };
                        }
                    }
                }
            }
        }
    }
    return translations;
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
    doc: CollectionDocumentStub | CollectionDocument | StaticDocument | StaticDocumentStub,
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

export const getTextLength = (
    doc: CollectionDocument | StaticDocument,
    lang: Language | undefined
): number | undefined => {
    if (!('textLength' in doc)) return undefined;
    const textLength = doc.textLength;
    if (!textLength) return undefined;
    if (typeof textLength === 'number') return textLength;
    return getFromLocalisedField<number>(doc, 'textLength', lang);
};

export const escapeHTML = (str: string = '') => str.replace(
    /[&<>'"]/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    }[c] || c)
);

export const normaliseAspectRatioForPadding = (ratio: string | undefined): string | undefined => {
    if (!ratio) return undefined;
    let numRatio: number | null = null;
    if (ratio.includes('/')) {
        const [w, h] = ratio.split('/').map(Number);
        if (!isNaN(w) && !isNaN(h) && w !== 0) {
            numRatio = h / w;
        }
    } else if (ratio.includes(':')) {
        const [w, h] = ratio.split(':').map(Number);
        if (!isNaN(w) && !isNaN(h) && w !== 0) {
            numRatio = h / w;
        }
    } else {
        const parsed = Number(ratio);
        if (!isNaN(parsed) && parsed > 0) {
            numRatio = 1 / parsed; // important: assume it's width/height, invert for padding
        }
    }
    if (!numRatio || numRatio <= 0) {
        numRatio = 9 / 16;
    }
    return (numRatio * 100) + '%'; // convert to percentage padding
}

// export const renderIsoDate = (date: string | undefined, {
//     mode = 'full',
//     withFallback = false,
// }: {
//     mode?: 'full' | 'yearAndMonth' | 'yearOnly';
//     withFallback?: boolean;
// } = {}) => {
//     if (!date && !withFallback) { return; }
//     const isValidIsoDate = /^(\d{4})-(\d{2})-(\d{2})$/.test(date || '');
//     const safeDate = isValidIsoDate ? date : (withFallback ? '0000-00-00' : undefined);
//     if (!safeDate) { return; }
//     const [year, month, day] = safeDate.split('-');
//     switch (mode) {
//         case 'full': return `${day}_${month}_${year}`;
//         case 'yearAndMonth': return `${month}_${year}`;
//         case 'yearOnly': return year;
//         default: return;
//     }
// };