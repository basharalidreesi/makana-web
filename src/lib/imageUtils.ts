import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '@root/sanity/sanity.cli';
import type { SanityImageObject } from '@root/sanity/sanity.types';
import type { FitMode, SanityImageSource } from '@sanity/image-url/lib/types/types';
import { escapeHTML } from '@lib/contentUtils';

const builder = imageUrlBuilder(sanityClient);

export const buildSanityImage = (source: SanityImageSource | undefined) => {
    if (!source) return undefined;
    return builder.image(source);
};

export const generateOgImage = (source: SanityImageObject | undefined) => {
    return buildSanityImage(source)
        ?.width(1200)
        .height(630)
        .auto('format')
        .url()
};

const getSanityImageDimensions = (source: SanityImageObject | undefined): Record<'width' | 'height', number> | undefined => {
    if (!source || !source.asset) return undefined;
    const id =
        '_ref' in source.asset ? source.asset._ref
        : '_id' in source.asset ? source.asset._id
        : undefined;
    if (!id) return undefined;
    const parts = id.split('-'); // ['image', 'abc123', '1200x800', 'jpg']
    if (parts.length < 4) return undefined;
    const [widthStr, heightStr] = parts[2].split('x');
    const width = parseInt(widthStr, 10);
    const height = parseInt(heightStr, 10);
    return { width, height };
};

export const createSanityImage = ({
    source,
    width,
    height,
    alt = '',
    fit = 'max',
    dprs = [1, 1.5, 2],
    loading = 'lazy',
    sizes,
    previewBase64,
}: {
    source: SanityImageObject | undefined;
    width?: number;
    height?: number;
    alt?: string;
    fit?: FitMode;
    dprs?: number[];
    loading?: string;
    sizes?: string;
    previewBase64?: string;
}): string | undefined => {
    if (!source || !source.asset) return undefined;
    const dimensions = getSanityImageDimensions(source);
    width = width ?? dimensions?.width;
    height = height ?? dimensions?.height;
    if (!width || !height) return undefined;
    const builder = buildSanityImage(source);
    if (!builder) return undefined;
    const src = builder.width(width).height(height).auto('format').fit(fit).url();
    const srcSet = dprs.map((dpr) => builder
        .width(Math.round(width * dpr))
        .height(Math.round(height * dpr))
        .fit(fit)
        .auto('format')
        .url() + ` ${dpr}x`
    ).join(', ');
    const altText = escapeHTML(alt?.trim() || '');
    let hasPreview = false;
    if ('metadata' in source.asset) {
        hasPreview = !!source.asset.metadata?.isOpaque;
        if (!previewBase64 && source.asset.metadata?.lqip) {
            previewBase64 = source.asset.metadata.lqip;
        }
    }
    const styles = hasPreview ? [
            `background-image: url('${previewBase64}')`,
            'background-size: cover',
            'background-position: center',
    ] : [];
    const stylesString = styles.filter(Boolean).join('; ');
    return (`
        <img
            src='${src}'
            width='${width}'
            height='${height}'
            alt='${altText}'
            ${srcSet ? `srcset='${srcSet}'` : ''}
            ${sizes ? `sizes='${sizes}'` : ''}
            ${loading ? `loading='${loading}'` : ''}
            decoding='async'
            ${stylesString ? `style="${stylesString};"` : ''}
            data-orientation='${
                width > height ? 'landscape'
                : height > width ? 'portrait'
                : 'square'
            }'
        />
    `);
};

export const fetchSvg = async (source: string | undefined): Promise<string | undefined> => {
    if (!source) return undefined;
    try {
        const res = await fetch(source);
        if (!res.ok) return undefined;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('image/svg')) return undefined;
        const svg = await res.text();
        if (!svg) return undefined;
        return svg
            .replace(/\s*(style|class|id)\s*=\s*(['"])[\s\S]*?\2/gi, '')
            .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '');
    } catch {
        console.warn('Logo fetch failed');
        console.warn('Using fallback logo');
        return undefined;
    }
};