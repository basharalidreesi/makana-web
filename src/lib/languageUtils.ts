import type { Language } from '@root/sanity/sanity.types';

type LanguageDefinition = {
    title: string;
    dir: string;
    default?: boolean;
};

export const SUPPORTED_LANGUAGES_RECORD: Record<Language, LanguageDefinition> = {
    ar: {
        title: 'Arabic',
        dir: 'rtl',
    },
    en: {
        title: 'English',
        dir: 'ltr',
        default: true,
    },
};

export const SUPPORTED_LANGUAGES = Object.entries(SUPPORTED_LANGUAGES_RECORD).map(
    ([id, def]) => ({ id: id as Language, ...def })
);

export const SUPPORTED_LANGUAGES_IDS = Object.keys(SUPPORTED_LANGUAGES_RECORD) as Language[];

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

let cachedDefaultLanguage: ({ id: Language } & LanguageDefinition) | undefined = undefined;

export const DEFAULT_LANGUAGE = (() => {
    if (cachedDefaultLanguage) return cachedDefaultLanguage;
    const entry = Object.entries(SUPPORTED_LANGUAGES_RECORD).find(([_, def]) => def.default);
    if (!entry) throw new Error('No default language defined in SUPPORTED_LANGUAGES');
    const [id, def] = entry;
    cachedDefaultLanguage = { id: id as Language, ...def };
    return cachedDefaultLanguage;
})();

export const DEFAULT_LANGUAGE_ID = DEFAULT_LANGUAGE.id;

export const DEFAULT_LANGUAGE_DIR = DEFAULT_LANGUAGE.dir;

// FSI and PDI are used for directional isolation in mixed LTR/RTL contexts
export const FSI = '\u2068';
export const PDI = '\u2069'