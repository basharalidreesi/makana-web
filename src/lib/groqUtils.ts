import { SUPPORTED_LANGUAGES_IDS } from './languageUtils';

const PT_LINK_MARK_RESOLVER_QUERY = (`
    markDefs[]{
        ...,
        type == 'internal' => {
            internalTarget->{
                _type,
                slug,
            }
        },
        type == 'external' => {
            externalTarget
        }
    }
`);

const PT_IMAGE_BLOCK_RESOLVER_QUERY = (`
    _type == 'imageBlock' => {
        ...,
        images[] {
            ...,
            asset {
                ...,
                'metadata': @->metadata
            }
        },
        caption[] {
            ...,
            ${PT_LINK_MARK_RESOLVER_QUERY}
        }
    }
`);

const PT_AUDIO_BLOCK_RESOLVER_QUERY = (`
    _type == 'audioBlock' => {
        ...,
        caption[] {
            ...,
            ${PT_LINK_MARK_RESOLVER_QUERY}
        }
    }
`);

const PT_FORM_BLOCK_RESOLVER_QUERY = (`
    _type == 'formBlock' => {
        form->
    }
`);

const PT_RESOLVERS = [
    PT_LINK_MARK_RESOLVER_QUERY,
    PT_IMAGE_BLOCK_RESOLVER_QUERY,
    PT_AUDIO_BLOCK_RESOLVER_QUERY,
    PT_FORM_BLOCK_RESOLVER_QUERY
].join(', ');

const definedContentLangs = SUPPORTED_LANGUAGES_IDS
    .map((langId) => `defined(content.${langId})`).join(' || ');

export const RESOLVED_CONTENT_QUERY = (`
    'content': select(
        defined(content) && (${definedContentLangs}) => content {
            ${SUPPORTED_LANGUAGES_IDS.map((langId) => {
                return (`
                    ${langId}[] {
                        ...,
                        ${PT_RESOLVERS}
                    }
                `);
            })}
        },
        defined(content) && !(${definedContentLangs}) => content[] {
            ...,
            ${PT_RESOLVERS}
        }
    )
`);