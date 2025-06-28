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