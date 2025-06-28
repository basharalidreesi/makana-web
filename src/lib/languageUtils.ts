import type { Language, TargetableAndStaticDocumentTypes } from '@root/sanity/sanity.types';

type LanguageDefinition = {
    title: string;
    dir: string;
    abbreviation: string;
    default?: boolean;
};

const SUPPORTED_LANGUAGES_RECORD: Record<Language, LanguageDefinition> = {
    ar: {
        title: 'Arabic',
        dir: 'rtl',
        abbreviation: 'ع',
    },
    en: {
        title: 'English',
        dir: 'ltr',
        abbreviation: 'en',
        default: true,
    },
};

export const SUPPORTED_LANGUAGES = Object.entries(SUPPORTED_LANGUAGES_RECORD).map(
    ([id, def]) => ({ id: id as Language, ...def })
);

const ensureCompleteOrder = <T extends Language[]>(arr: [...T] & ([Language] extends [T[number]] ? unknown : ['Error: Missing languages in order'])) => { return arr; }

const languageOrder = ensureCompleteOrder(['en', 'ar']);

export const SUPPORTED_LANGUAGES_SORTED = Object.entries(SUPPORTED_LANGUAGES_RECORD)
    .sort(([idA], [idB]) => {
        const indexA = languageOrder.indexOf(idA as Language);
        const indexB = languageOrder.indexOf(idB as Language);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    })
    .map(([id, def]) => ({ id: id as Language, ...def }));

export const DEFAULT_LANGUAGE = (() => {
    const lang = Object.entries(SUPPORTED_LANGUAGES_RECORD).find(([_, def]) => def.default);
    if (!lang) throw new Error('No default language defined in SUPPORTED_LANGUAGES');
    return {
        id: lang[0] as Language,
        ...lang[1]
    };
})();

type LocalisedRecord<T> = {
    [L in Language]: T;
};

type UICategoryDictionary = {
  [K in TargetableAndStaticDocumentTypes]: LocalisedRecord<string>;
};

export const UI_DICTIONARY: UICategoryDictionary & {
    untitled: LocalisedRecord<string>;
    homePage: LocalisedRecord<string>;
} = {
    untitled: {
        ar: 'بلا عنوان',
        en: 'Untitled',
    },
    homePage: {
        ar: 'الصفحة الرئيسة',
        en: 'Home',
    },
    aboutPage: {
        ar: 'عن مكانة',
        en: 'About makāna',
    },
    project: {
        ar: 'مشاريع',
        en: 'Projects',
    },
    writing: {
        ar: 'كتابات',
        en: 'Writings',
    },
    happening: {
        ar: 'برامج',
        en: 'Happenings',
    },
    resource: {
        ar: 'موارد',
        en: 'Resources',
    },
};