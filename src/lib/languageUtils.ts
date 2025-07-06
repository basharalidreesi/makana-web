import type { CollectionDocumentType, Language, StaticDocumentType } from '@root/sanity/sanity.types';

type LanguageDefinition = {
    title: string;
    dir: string;
    symbol: string;
    default?: boolean;
};

export const SUPPORTED_LANGUAGES_RECORD: Record<Language, LanguageDefinition> = {
    ar: {
        title: 'Arabic',
        dir: 'rtl',
        symbol: `<svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12.07,18c-.57,0-1.09-.07-1.56-.22-.47-.15-.87-.36-1.21-.65s-.59-.65-.77-1.07c-.18-.42-.27-.91-.27-1.47,0-.71.22-1.36.65-1.95.44-.59,1.05-1.05,1.85-1.39v-.07c-.5-.31-.89-.68-1.17-1.13s-.42-.91-.42-1.41c0-.4.07-.76.2-1.08.13-.33.31-.6.53-.84.22-.23.49-.41.8-.54.31-.13.63-.19.98-.19.5,0,.94.1,1.31.31.37.21.68.5.92.88l-.66.77c-.23-.28-.47-.49-.73-.62-.26-.13-.56-.2-.89-.2-.5,0-.88.14-1.14.42s-.39.65-.39,1.1c0,.29.05.54.16.75s.26.38.46.52c.19.13.42.23.69.3.27.07.56.1.88.1.37,0,.75-.04,1.15-.12l1.07-.2.2,1.03-1.74.37c-1.28.27-2.22.64-2.83,1.09-.61.45-.91,1.03-.91,1.74v.26c0,.74.25,1.31.76,1.72.51.4,1.2.61,2.08.61.57,0,1.1-.1,1.58-.31.48-.21.94-.54,1.39-1.01l.71.88c-.55.57-1.11.99-1.7,1.24-.59.26-1.25.38-1.99.38Z'/></svg>`,
    },
    en: {
        title: 'English',
        dir: 'ltr',
        symbol: `<svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M10.38,16.5h-5.49V7.5h5.49v.95h-4.41v3.02h4.15v.95h-4.15v3.12h4.41v.95Z'/><path d='M17.87,16.5l-3.29-5.49-1.08-2h-.04v7.49h-1.06V7.5h1.25l3.29,5.49,1.08,2h.04v-7.49h1.06v9h-1.25Z'/></svg>`,
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

type LocalisedUIDictionaryRecord<T> = {
    [L in Language]: T;
};

type UICategoryDictionary = {
  [K in (CollectionDocumentType | StaticDocumentType)]: LocalisedUIDictionaryRecord<string>;
};

export const UI_DICTIONARY: UICategoryDictionary & {
    websiteTitle: LocalisedUIDictionaryRecord<string>;
    untitledLabel: LocalisedUIDictionaryRecord<string>;
    navigationMenuLabel: LocalisedUIDictionaryRecord<string>;
    languageSwitchLabel: LocalisedUIDictionaryRecord<string>;
    submitButtonLabel: LocalisedUIDictionaryRecord<string>;
    closeButtonLabel: LocalisedUIDictionaryRecord<string>;
    optionSelectPlaceholder: LocalisedUIDictionaryRecord<string>;
    error404Message: LocalisedUIDictionaryRecord<string>;
} = {
    websiteTitle: {
        ar: 'مكانة',
        en: 'makāna',
    },
    untitledLabel: {
        ar: 'بلا عنوان',
        en: 'Untitled',
    },
    navigationMenuLabel: {
        ar: 'القائمة العربية',
        en: 'English menu',
    },
    languageSwitchLabel: {
        ar: 'المطالعة بالعربية',
        en: 'View in English',
    },
    submitButtonLabel: {
        ar: 'إرسال',
        en: 'Submit',
    },
    closeButtonLabel: {
        ar: 'إغلاق',
        en: 'Close',
    },
    optionSelectPlaceholder: {
        ar: '-- يرجى الاختيار --',
        en: '-- select an option --',
    },
    error404Message: {
        ar: `<h1>خطأ 404: الصفحة غير متوفرة</h1><p>قد تكون الصفحة التي تبحثون عنها نُقلت أو حُذفت، أو ربّما لم تكن موجودة أصلًا.</p><p>يمكنكم تجربة ما يلي:</p><ol><li>التحقق من صحة الرابط</li><li>العودة إلى <a href='/'>الصفحة الرئيسة</a></li></ol><p>إذا استمرت المشكلة، يُرجى التواصل معنا أو تكرار المحاولة لاحقًا.</p><p><em>مكانة</em></p>`,
        en: `<h1>Error 404: Page not found</h1><p>The page you are looking for may have been moved or deleted, or it might have never existed at all.</p><p>A few things you can try:</p><ol><li>Check the URL for any typos</li><li>Go back to the <a href='/'>homepage</a></li></ol><p>If the problem persists, please contact us or try again later.</p><p><em>makāna</em></p>`,
    },
    aboutPage: {
        ar: 'عن مكانة',
        en: 'About',
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