import type { Language, LocalisedPageBuilder, LocalisedSlug, LocalisedString, LocalisedText, PageBuilder, Project, Resource, Slug, StaticDocument, TargetableDocument, Writing } from '@root/sanity/sanity.types';
import { DEFAULT_LANGUAGE, UI_DICTIONARY } from './languageUtils';

export const groupByLanguageField = (items: any[] = [], langId: string) => {
    return items.filter((item) => item.language === langId);
};

export const groupByLocalisedSlug = (items: any[] = [], langId: string) => {
    return items.filter((item) => item.slug?.[langId])
};

export const getSlug = (slug: Slug | LocalisedSlug | undefined, lang: Language | undefined): string | undefined => {
    if (!slug) { return undefined; }
    if ('current' in slug) {
        return slug.current;
    }
    if (typeof slug === 'object' && lang && lang in slug) {
        return (slug as Record<Language, Slug>)[lang]?.current;
    }
    return undefined;
}

export const getTitle = (doc: TargetableDocument | StaticDocument, lang: Language | undefined): string => {
    const def = UI_DICTIONARY[doc._type][lang || DEFAULT_LANGUAGE.id];
    if (!doc.title) {
        return def;
    }
    if (typeof doc.title === 'string') {
        return doc.title;
    }
    if (typeof doc.title === 'object' && lang && lang in doc.title) {
        return (doc.title as Record<Language, string>)[lang] ?? def;
    }
    return def;
}

export const getSummary = (summary: string | LocalisedText | undefined, lang: Language | undefined): string | undefined => {
    if (!summary) { return undefined; }
    if (typeof summary === 'string') {
        return summary;
    }
    if (typeof summary === 'object' && lang && lang in summary) {
        return (summary as Record<Language, string>)[lang];
    }
    return undefined;
}

const hasDateField = (doc: TargetableDocument): doc is Project | Writing | Resource => {
    return ['project', 'writing', 'resource'].includes(doc._type);
};

export const getDate = (doc: TargetableDocument) => {
    return hasDateField(doc) ? doc.date : undefined;
}

export const getContent = (content: PageBuilder | LocalisedPageBuilder | undefined, lang: Language | undefined): PageBuilder | undefined => {
    if (!content) { return undefined; }
    if (Array.isArray(content)) {
        return content;
    }
    if (typeof content === 'object' && lang && lang in content) {
        return (content as Record<Language, PageBuilder>)[lang];
    }
    return undefined;
}

export async function fetchSvgContent(url: URL): Promise<string | undefined> {
    try {
        if (!url) { throw new Error('No URL to fetch SVG from'); }
        const response = await fetch(url);
        if (!response.ok) { throw new Error('Failed to fetch SVG'); }
        const svg = await response.text();
        return svg;
    } catch {
        return undefined;
    }
}