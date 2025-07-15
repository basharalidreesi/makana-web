import type { AnyContentDocument, AnyLocationedDocument, AnyMetaedDocument, AnyRichlyDatedDocument, AnySimplyDatedDocument, AnyTargetableDocument, AnyTargetableDocumentStub, AnyTargetableDocumentType, AnyTitledDocument, Language, PageBuilder } from '@root/sanity/sanity.types';
import { DEFAULT_LANGUAGE_ID, FSI, PDI, SUPPORTED_LANGUAGES_IDS } from '@lib/languageUtils';
import { UI_DICTIONARY } from '@lib/uiDictionary';
import { getFromRegistry } from '@lib/idRegistry';
import { DateTime } from 'luxon';

const hasSlugForLang = (
    doc: AnyTargetableDocumentStub | undefined,
    lang: Language | undefined,
): boolean => !!getSlug(doc, lang);

export const filterByLocalisedSlug = (
    docs: AnyTargetableDocument[] | undefined = [],
    lang: Language,
): AnyTargetableDocument[] | undefined => {
    if (!docs || !Array.isArray(docs) || docs.length === 0 || !lang) return undefined;
    return docs.filter((doc) => hasSlugForLang(doc, lang));
};

export const getSlug = (
    doc: AnyTargetableDocumentStub | undefined,
    lang: Language | undefined,
): string | undefined => {
    if (!doc || !lang) return undefined;
    const slug = doc.slug?.[lang]?.current;
    if (!slug) return undefined;
    return slug;
};

export const getPreferredSlug = (
    doc: AnyTargetableDocumentStub | undefined,
    lang: Language | undefined,
): { slug: string; langUsed: Language } | undefined => {
    if (!doc || !lang) return undefined;
    // Try requested lang, then fallback to default, then any other supported langs
    const preferredLangOrder = [
        lang,
        lang === DEFAULT_LANGUAGE_ID ? undefined : DEFAULT_LANGUAGE_ID,
        ...SUPPORTED_LANGUAGES_IDS.filter((l) => l !== lang && l !== DEFAULT_LANGUAGE_ID),
    ].filter(Boolean);
    for (const preferredLang of preferredLangOrder as Language[]) {
        const preferredSlug = getSlug(doc, preferredLang);
        if (preferredSlug) {
            return {
                slug: preferredSlug,
                langUsed: preferredLang,
            }
        }
    }
    return undefined;
};

export const getTitle = (
    doc: AnyTitledDocument | undefined,
    lang: Language | undefined,
): string => {
    const fallbackTitle = UI_DICTIONARY.untitledLabel[lang ?? DEFAULT_LANGUAGE_ID]
    if (!doc || !lang) return fallbackTitle;
    const title = doc.title?.[lang];
    return title ?? fallbackTitle;
};

export const getSummary = (
    doc: AnyMetaedDocument | undefined,
    lang: Language | undefined,
): string | undefined => {
    if (!doc || !lang) return undefined;
    const summary = doc.summary?.[lang];
    if (!summary) return undefined;
    return summary;
};

export const getContent = (
    doc: AnyContentDocument | undefined,
    lang: Language | undefined,
): PageBuilder | undefined => {
    if (!doc || !lang) return undefined;
    const content = doc.content?.[lang];
    if (!content) return undefined;
    return content;
};

export const getTextLength = (
    doc: AnyContentDocument | undefined,
    lang: Language | undefined,
): number | undefined => {
    if (!doc || !lang) return undefined;
    const textLength = doc.textLength?.[lang];
    if (!textLength) return undefined;
    return textLength;
};

type DateFormat = 'iso' | 'compact' | 'readable';

const pad = (n: number): string => n.toString().padStart(2, '0');

const formatDate = (
    dateString: string | undefined,
    format: DateFormat,
    lang: Language | undefined,
): string | undefined => {
    if (!dateString || !lang) return undefined;
    const dt = DateTime.fromISO(dateString);
    if (!dt.isValid) return undefined;
    const day = pad(dt.day);
    const month = pad(dt.month);
    const year = dt.year.toString();
    switch (format) {
        case 'iso':
            return dt.toISODate();
        case 'compact':
            return `${day}_${month}_${year}`;
        case 'readable':
            return `${dt.day} ${UI_DICTIONARY.monthNames[lang][dt.month - 1]} ${year}`;
        default: return undefined;
    }
};

const formatDateTime = (
    dateString: string | undefined,
    time: { hours?: string; minutes?: string; } | undefined,
    timezone: string | undefined,
    format: DateFormat,
    lang: Language | undefined,
): string | undefined => {
    const fallbackDate = formatDate(dateString, format, lang);
    if (!dateString || !time?.hours || !timezone || !lang) return fallbackDate;
    const hours = parseInt(time.hours ?? '', 10);
    const minutes = time.minutes ? parseInt(time.minutes, 10) : 0;
    if (isNaN(hours) || hours < 0 || hours > 23) return fallbackDate;
    if (isNaN(minutes) || minutes < 0 || minutes > 59) return fallbackDate;
    const dt = DateTime.fromISO(dateString, { zone: timezone }).set({
        hour: hours,
        minute: minutes,
    });
    if (!dt.isValid) return fallbackDate;
    const day = pad(dt.day);
    const month = pad(dt.month);
    const year = dt.year.toString();
    const monthName = UI_DICTIONARY.monthNames[lang][dt.month - 1];
    const comma = UI_DICTIONARY.comma[lang];
    const timeString = `${pad(dt.hour % 12 || 12)}:${pad(dt.minute)} ${dt.hour < 12 ? UI_DICTIONARY.timeAmLabel[lang] : UI_DICTIONARY.timePmLabel[lang]}`
    switch (format) {
        case 'iso':
            return dt.toISO({ suppressMilliseconds: true });
        case 'compact':
            return `${FSI}${day}_${month}_${year}${PDI}${comma} ${timeString}`;
        case 'readable':
            return `${FSI}${dt.day} ${monthName} ${year}${PDI}${comma} ${timeString}`;
        default:
            return undefined;
    }
};

export const getDate = (
    doc: AnySimplyDatedDocument | AnyRichlyDatedDocument | undefined,
    format: DateFormat,
    lang: Language | undefined,
): string | undefined => {
    if (!doc || !lang) return undefined;
    const rawDate = 'date' in doc ? doc.date : 'startDate' in doc ? doc.startDate : undefined;
    return formatDate(rawDate, format, lang);
};

export const getDateTime = (
    doc: AnyRichlyDatedDocument | undefined,
    format: DateFormat,
    lang: Language | undefined,
): string | undefined => {
    if (!doc || !lang) return undefined;
    return formatDateTime(doc.startDate, doc.startTime, doc.timezone, format, lang);
};

export const getLocation = (
    doc: AnyLocationedDocument | undefined,
    lang: Language | undefined,
): string | undefined => {
    if (!doc || !lang) return undefined;
    const location = doc.location?.[lang];
    if (!location) return undefined;
    return location;
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

// Function to convert an aspect ratio (assumes width ÷ height in `16:9`, `16/9`, `1`, or `1.5` formats) to a `padding-bottom` percentage string
export const normaliseAspectRatioForPadding = (ratio: string | undefined): string | undefined => {
    if (!ratio) return undefined;
    let heightOverWidthRatio: number | undefined = undefined;
    const separator = ratio.includes('/') ? '/' : ratio.includes(':') ? ':' : undefined;
    if (separator) {
        const [width, height] = ratio.split(separator).map(Number);
        if (!isNaN(width) && !isNaN(height) && width !== 0) {
            heightOverWidthRatio = height / width;
        }
    } else {
        // Assume decimal format
        const numeric = Number(ratio);
        if (!isNaN(numeric) && numeric > 0) {
            heightOverWidthRatio = 1 / numeric; // Invert to get height ÷ width
        }
    }
    if (!heightOverWidthRatio || heightOverWidthRatio <= 0) {
        heightOverWidthRatio = 9 / 16;
    }
    return `${heightOverWidthRatio * 100}%`; // Convert to percentage string for `padding-bottom`
};

export type AlternateDocument = {
    lang: Language;
    type: AnyTargetableDocumentType;
    slug: string;
    title: string;
    route: string;
};

export const getAlternates = (
    doc: AnyTargetableDocumentStub | undefined,
    lang: Language | undefined,
): AlternateDocument[] | undefined => {
    if (!doc || !lang) return undefined;
    const allVersions = getFromRegistry(doc._id);
    if (!allVersions) return undefined;
    const alternates: AlternateDocument[] = [];
    SUPPORTED_LANGUAGES_IDS.forEach((l) => {
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