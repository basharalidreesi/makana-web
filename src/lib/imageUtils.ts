import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '@root/sanity/sanity.cli';
import type { SanityImageObject } from '@root/sanity/sanity.types';

const builder = imageUrlBuilder(sanityClient);

export const buildSanityImage = (source: SanityImageObject | undefined) => {
    if (!source?.asset?._ref) return undefined;
    return builder.image(source);
};

export const generateOgImage = (source: SanityImageObject | undefined) => {
    return buildSanityImage(source)?.width(1200).height(630).fit('crop').auto('format').url()
};

export async function fetchSvg(source: string | undefined): Promise<string | undefined> {
    if (!source) return undefined;
    let svg;
    try {
        const res = await fetch(source);
        if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('image/svg')) {
                svg = await res.text();
                svg = svg
                    // remove all classes, ids, and inline styling
                    .replace(/\s*(style|class|id)\s*=\s*(['"])[\s\S]*?\2/gi, '')
                    // remove all <style> elements
                    .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '');
            }
        }
    } catch (err) {
        console.error('Logo fetch failed:', err);
    }
    return svg;
}