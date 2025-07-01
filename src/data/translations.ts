import type { TranslationGroup } from '@root/sanity/sanity.types';
import sanityClient from '@root/sanity/sanity.cli';
import { SUPPORTED_LANGUAGES_IDS } from '@lib/languageUtils';

const translationGroups: TranslationGroup[] | undefined = await sanityClient.fetch(`
    *[_type == 'translationGroup' && (${SUPPORTED_LANGUAGES_IDS.map((l) => `defined(translations.${l})`).join(' || ')})] {
        translations,
    }
`);