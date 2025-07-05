import type { CollectionDocument, CollectionDocumentStub, CollectionDocumentType, Language, PageBuilder, StaticDocument, StaticDocumentStub, StaticDocumentType } from '@root/sanity/sanity.types';
import { DEFAULT_LANGUAGE_ID, SUPPORTED_LANGUAGES_IDS, UI_DICTIONARY } from '@lib/languageUtils';
import { getFromRegistry } from '@lib/registry';

const hasSlugForLang = (
    doc: CollectionDocument | StaticDocument | undefined,
    lang: Language | undefined
): boolean => {
    if (!doc || !lang) return false;
    const slug = doc.slug?.[lang]?.current;
    return !!slug;
};

export const groupByLocalisedSlug = (
    docs: (CollectionDocument | StaticDocument)[] | undefined = [],
    lang: Language
): (CollectionDocument | StaticDocument)[] | undefined => {
    if (!docs || !Array.isArray(docs) || docs.length === 0 || !lang) return undefined;
    return docs.filter((doc) => hasSlugForLang(doc, lang));
};

export const getSlug = (
    doc: CollectionDocumentStub | CollectionDocument | StaticDocument | StaticDocumentStub | undefined,
    lang: Language | undefined
): string | undefined => {
    if (!doc || !lang) return undefined;
    const slug = doc.slug?.[lang]?.current;
    if (!slug) return undefined;
    return slug;
};

export const getTitle = (
    doc: CollectionDocument | StaticDocument | undefined,
    lang: Language | undefined
): string => {
    const fallbackTitle = UI_DICTIONARY.untitled[lang ?? DEFAULT_LANGUAGE_ID]
    if (!doc || !lang) return fallbackTitle;
    const title = doc.title?.[lang];
    return title ?? fallbackTitle;
};

export const getSummary = (
    doc: CollectionDocument | StaticDocument | undefined,
    lang: Language | undefined
): string | undefined => {
    if (!doc || !lang) return undefined;
    if (!('summary' in doc)) return undefined;
    const summary = doc.summary?.[lang];
    if (!summary) return undefined;
    return summary;
};

export const getContent = (
    doc: CollectionDocument | StaticDocument | undefined,
    lang: Language | undefined
): PageBuilder | undefined => {
    if (!doc || !lang) return undefined;
    const content = doc.content?.[lang];
    if (!content) return undefined;
    return content;
};

export const getTextLength = (
    doc: CollectionDocument | StaticDocument | undefined,
    lang: Language | undefined
): number | undefined => {
    if (!doc || !lang) return undefined;
    if (!('textLength' in doc)) return undefined;
    const textLength = (doc.textLength as any)?.[lang];
    if (!textLength) return undefined;
    return textLength;
};

export const escapeHtml = (str: string = '') => str.replace(
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

export type AlternateDocument = {
    lang: Language;
    type: CollectionDocumentType | StaticDocumentType;
    slug: string;
    title: string;
    route: string;
};

export const getAlternates = (
    doc: CollectionDocument | StaticDocument | undefined,
    lang: Language | undefined
): AlternateDocument[] | undefined => {
    if (!doc || !lang) return undefined;
    const allVersions = getFromRegistry(doc._id);
    if (!allVersions) return undefined;
    const alternates: AlternateDocument[] = [];
    SUPPORTED_LANGUAGES_IDS.map((l) => {
        if (l === lang) return;
        const entry = allVersions[l];
        if (entry) {
            alternates.push({
                lang: l,
                ...entry
            });
        }
    });
    return alternates;
};