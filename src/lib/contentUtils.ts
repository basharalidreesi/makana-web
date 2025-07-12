import type { AnyContentDocument, AnyLocationedDocument, AnyMetaedDocument, AnyRichlyDatedDocument, AnySimplyDatedDocument, AnyTargetableDocument, AnyTargetableDocumentStub, AnyTargetableDocumentType, AnyTitledDocument, Language, PageBuilder } from '@root/sanity/sanity.types';
import { DEFAULT_LANGUAGE_ID, FSI, PDI, SUPPORTED_LANGUAGES_IDS, SUPPORTED_LANGUAGES_RECORD, UI_DICTIONARY } from '@lib/languageUtils';
import { getFromRegistry } from '@lib/registry';
import { DateTime } from 'luxon';

const hasSlugForLang = (
    doc: AnyTargetableDocumentStub | undefined,
    lang: Language | undefined,
): boolean => !!getSlug(doc, lang);

export const groupByLocalisedSlug = (
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

const pad = (n: number): string => n.toString().padStart(2, '0');

export const getDate = (
    doc: AnySimplyDatedDocument | AnyRichlyDatedDocument | undefined,
    format: 'iso' | 'custom',
): string | undefined => {
    if (!doc) return undefined;
    if ('date' in doc) {
        if (format === 'iso') return doc.date ?? undefined;
        const dateString = renderDate(doc.date)?.dateString;
        if (!dateString) return undefined;
        return dateString;
    }
    if ('startDate' in doc) {
        if (format === 'iso') return doc.startDate ?? undefined;
        const dateString = renderDate(doc.startDate)?.dateString;
        if (!dateString) return undefined;
        return dateString;
    }
};

export const getDateTime = (
    doc: AnyRichlyDatedDocument | undefined,
    lang: Language | undefined,
): string | undefined => {
    if (!doc || !lang) return undefined;
    const startDate = doc.startDate;
    if (!startDate) return undefined;
    const renderedDate = renderDate(startDate);
    if (!renderedDate) return undefined;
    const { day, month, year, dateString } = renderedDate;
    if (!day || !month || !year || !dateString) return undefined;
    const hours = doc.startTime?.hours ? parseInt(doc.startTime.hours, 10) : undefined;
    const minutes = hours ? (doc.startTime?.minutes ? parseInt(doc.startTime.minutes, 10) : 0) : undefined;
    const timeZoneName = doc.timezone;
    if (!hours || !minutes || !timeZoneName) return getDate(doc, 'custom');
    const dt = DateTime.fromObject({
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day, 10),
        hour: hours,
        minute: minutes,
    }, { zone: timeZoneName });
    if (!dt.isValid) return getDate(doc, 'custom');
    const timeFormatter = new Intl.DateTimeFormat(lang, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timeZoneName,
        numberingSystem: 'latn',
    });
    const timeString = timeFormatter.format(dt.toJSDate());
    const comma = SUPPORTED_LANGUAGES_RECORD[lang].comma;
    return `${FSI}${dateString}${PDI}${comma} ${timeString}`;
};

export const renderDate = (
    date: string | undefined,
): { day: string; month: string; year: string; dateString: string; } | undefined => {
    if (!date) return undefined;
    const [year, month, day] = date.split('-').map(Number);
    const dateString = `${pad(day)}_${pad(month)}_${year}`;
    if (!day || !month || !year) return undefined;
    return {
        day: pad(day),
        month: pad(month),
        year: String(year),
        dateString: dateString,
    };
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