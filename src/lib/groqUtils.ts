import { SUPPORTED_LANGUAGES_IDS } from '@lib/languageUtils';

const PT_LINK_MARK_RESOLVER_QUERY = (`
    markDefs[]{
        ...,
        type == 'internal' => {
            internalTarget->{
                _id,
                _type,
                slug
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

export const definedLocalisedSlug = SUPPORTED_LANGUAGES_IDS
    .map((langId) => `defined(slug.${langId}.current)`).join(' || ');

export const definedMapAsset = `defined(mapAsset.asset)`;

export const RESOLVED_CONTENT_QUERY = (`
    content {
        ${SUPPORTED_LANGUAGES_IDS.map((langId) => (`
            ${langId}[] {
                ...,
                ${PT_RESOLVERS}
            }
        `))}
    },
    'textLength': {
        ${SUPPORTED_LANGUAGES_IDS.map((langId) => (`
            '${langId}': length(pt::text(content.${langId}))
        `)).join(',')}
    }
`);