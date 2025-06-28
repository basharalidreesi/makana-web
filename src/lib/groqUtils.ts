import { SUPPORTED_LANGUAGES_IDS } from './languageUtils';

const PT_LINK_RESOLVER_QUERY = (`
    markDefs[]{
        ...,
        type == 'internal' => {
            internalTarget->
        },
        type == 'external' => {
            externalTarget
        }
    }
`);

const definedContentLangs = SUPPORTED_LANGUAGES_IDS.map((langId) => `defined(content.${langId})`).join(' || ');

export const RESOLVED_CONTENT_QUERY = (`
    'content': select(
        defined(content) && (${definedContentLangs}) => content {
            ${SUPPORTED_LANGUAGES_IDS.map((langId) => {
                return (`
                    ${langId}[] {
                        ...,
                        ${PT_LINK_RESOLVER_QUERY}
                    }
                `);
            })}
        },
        defined(content) && !(${definedContentLangs}) => content[] {
            ...,
            ${PT_LINK_RESOLVER_QUERY}
        }
    )
`);