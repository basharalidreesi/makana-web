import type { CollectionDocumentType, Language, StaticDocumentType } from '@root/sanity/sanity.types';

type LanguageDefinition = {
    title: string;
    dir: string;
    abbreviation: string;
    default?: boolean;
};

export const SUPPORTED_LANGUAGES_RECORD: Record<Language, LanguageDefinition> = {
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

export const SUPPORTED_LANGUAGES_IDS = Object.keys(SUPPORTED_LANGUAGES_RECORD);

const ensureCompleteOrder = <T extends Language[]>(arr: [...T] & ([Language] extends [T[number]] ? unknown : ['Error: Missing languages in order'])) => { return arr; }

const LANGUAGE_ORDER = ensureCompleteOrder([
    'en',
    'ar',
]);

export const SUPPORTED_LANGUAGES_ORDERED = Object.entries(SUPPORTED_LANGUAGES_RECORD)
    .sort(([idA], [idB]) => {
        const indexA = LANGUAGE_ORDER.indexOf(idA as Language);
        const indexB = LANGUAGE_ORDER.indexOf(idB as Language);
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

export const DEFAULT_LANGUAGE_ID = DEFAULT_LANGUAGE.id;

export const DEFAULT_LANGUAGE_DIR = DEFAULT_LANGUAGE.dir;

type LocalisedRecord<T> = {
    [L in Language]: T;
};

type UICategoryDictionary = {
  [K in (CollectionDocumentType | StaticDocumentType)]: LocalisedRecord<string>;
};

export const UI_DICTIONARY: UICategoryDictionary & {
    untitled: LocalisedRecord<string>;
    navigation: LocalisedRecord<string>;
    switch: LocalisedRecord<string>;
    homePage: LocalisedRecord<string>;
    submit: LocalisedRecord<string>;
} = {
    untitled: {
        ar: 'بلا عنوان',
        en: 'Untitled',
    },
    navigation: {
        ar: 'القائمة العربية',
        en: 'English menu',
    },
    switch: {
        ar: 'التبديل إلى العربية',
        en: 'Switch to English',
    },
    homePage: {
        ar: 'الصفحة الرئيسة',
        en: 'Home',
    },
    submit: {
        ar: 'إرسال',
        en: 'Submit',
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