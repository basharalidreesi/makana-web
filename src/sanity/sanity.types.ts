export type Language = 'ar' | 'en'

export type CollectionDocument = Project | Writing | Happening | Resource

export type StaticDocument = AboutPage

export type CollectionDocumentType = CollectionDocument['_type']

export type StaticDocumentType = StaticDocument['_type']

export type CollectionDocumentStub = Pick<CollectionDocument, '_type' | 'slug'>

export type StaticDocumentStub = Pick<StaticDocument, '_type' | 'slug'>

export type Project = {
  _id: string
  _type: 'project'
  _createdAt: string
  _updatedAt: string
  _rev: string
  language?: Language
  title?: string
  slug?: Slug
  date?: string
  summary?: string
  mainImage?: SanityImageObject
  content?: PageBuilder
}

export type Writing = {
  _id: string
  _type: 'writing'
  _createdAt: string
  _updatedAt: string
  _rev: string
  language?: Language
  title?: string
  slug?: Slug
  date?: string
  summary?: string
  mainImage?: SanityImageObject
  content?: PageBuilder
}

export type Happening = {
  _id: string
  _type: 'happening'
  _createdAt: string
  _updatedAt: string
  _rev: string
  title?: LocalisedString
  slug?: LocalisedSlug
  startDate?: string
  startTime?: {
    hours?: string
    minutes?: string
  }
  timezone?: string
  location?: LocalisedString
  summary?: LocalisedText
  mainImage?: SanityImageObject
  content?: LocalisedPageBuilder
}

export type Resource = {
  _id: string
  _type: 'resource'
  _createdAt: string
  _updatedAt: string
  _rev: string
  title?: LocalisedString
  slug?: LocalisedSlug
  date?: string
  summary?: LocalisedText
  mainImage?: SanityImageObject
  content?: LocalisedPageBuilder
}

export type TranslationGroup = {
  _id: string
  _type: 'translationGroup'
  _createdAt: string
  _updatedAt: string
  _rev: string
  type?: 'project' | 'writing'
  translations?: {
    ar?: Project | Writing
    en?: Project | Writing
    // ar?:
    //   | {
    //       _ref: string
    //       _type: 'reference'
    //       _weak?: boolean
    //       [internalGroqTypeReferenceTo]?: 'project'
    //     }
    //   | {
    //       _ref: string
    //       _type: 'reference'
    //       _weak?: boolean
    //       [internalGroqTypeReferenceTo]?: 'writing'
    //     }
    // en?:
    //   | {
    //       _ref: string
    //       _type: 'reference'
    //       _weak?: boolean
    //       [internalGroqTypeReferenceTo]?: 'project'
    //     }
    //   | {
    //       _ref: string
    //       _type: 'reference'
    //       _weak?: boolean
    //       [internalGroqTypeReferenceTo]?: 'writing'
    //     }
  }
}

export type Form = {
  _id: string
  _type: 'form'
  _createdAt: string
  _updatedAt: string
  _rev: string
  referenceName?: string
  endpoint?: string
  fields?: Array<{
    type?: 'text' | 'textarea' | 'select' | 'checkbox' | 'hidden'
    name?: string
    label?: LocalisedString
    options?: Array<string>
    value?: string
    _key: string
  }>
  attributes?: Array<string>
}

export type HomePage = {
  _id: string
  _type: 'homePage'
  _createdAt: string
  _updatedAt: string
  _rev: string
  // featuredItems?: Array<
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'happening'
  //     }
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'project'
  //     }
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'resource'
  //     }
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'writing'
  //     }
  // >
  featuredItems?: Array<CollectionDocument>
}

export type AboutPage = {
  _id: string
  _type: 'aboutPage'
  _createdAt: string
  _updatedAt: string
  _rev: string
  title?: LocalisedString
  slug?: LocalisedSlug
  content?: LocalisedPageBuilder
}

export type Website = {
  _id: string
  _type: 'website'
  _createdAt: string
  _updatedAt: string
  _rev: string
  title?: LocalisedString
  summary?: LocalisedText
  keywords?: Array<string>
  logo?: SanityImageObject
  mainImage?: SanityImageObject
  analytics?: string
}

export type Link = {
  _type: 'link'
  type?: 'external' | 'internal'
  // internalTarget?:
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'happening'
  //     }
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'project'
  //     }
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'resource'
  //     }
  //   | {
  //       _ref: string
  //       _type: 'reference'
  //       _weak?: boolean
  //       [internalGroqTypeReferenceTo]?: 'writing'
  //     }
  internalTarget?: CollectionDocumentStub
  externalTarget?: string
}

export type Slug = {
  _type: 'slug'
  current?: string
  source?: string
}

export type LocalisedSlug = {
  [lang in Language]?: Slug;
}
export type LocalisedString = {
  [lang in Language]?: string;
}

export type LocalisedText = {
  [lang in Language]?: string;
}

export type LocalisedPageBuilder = {
  [lang in Language]?: PageBuilder;
}

export type PortableText = BodyPortableText | AuxiliaryPortableText

export type BodyPortableText = Array<{
  children?: Array<{
    marks?: Array<string>
    text?: string
    _type: 'span'
    _key: string
  }>
  style?: 'normal' | 'heading' | 'blockquote'
  listItem?: 'bullet' | 'number'
  markDefs?: Array<Link>
  level?: number
  _type: 'block'
  _key: string
}>

export type BodyPortableTextBlock = BodyPortableText[number]

export type AuxiliaryPortableText = Array<{
  children?: Array<{
    marks?: Array<string>
    text?: string
    _type: 'span'
    _key: string
  }>
  style?: 'normal'
  listItem?: never
  markDefs?: Array<Link>
  level?: number
  _type: 'block'
  _key: string
}>

export type PageBuilder = Array<
  | BodyPortableTextBlock
  | {
      // images?: Array<{
      //   asset?: {
      //     _ref: string
      //     _type: 'reference'
      //     _weak?: boolean
      //     [internalGroqTypeReferenceTo]?: 'sanity.imageAsset'
      //   }
      //   media?: unknown
      //   hotspot?: SanityImageHotspot
      //   crop?: SanityImageCrop
      //   altText?: string
      //   _type: 'image'
      //   _key: string
      // }>
      images?: Array<SanityImageObject & {
        altText?: string
      }>
      caption?: AuxiliaryPortableText
      _type: 'imageBlock'
      _key: string
    }
  | {
      url?: string
      aspectRatio?: string
      caption?: AuxiliaryPortableText
      _type: 'videoBlock'
      _key: string
    }
  | {
      file?: SanityFileObject
      caption?: AuxiliaryPortableText
      _type: 'audioBlock'
      _key: string
    }
  | {
      // form?: {
      //   _ref: string
      //   _type: 'reference'
      //   _weak?: boolean
      //   [internalGroqTypeReferenceTo]?: 'form'
      // }
      form?: Form
      _type: 'formBlock'
      _key: string
    }
>

export type SanityImagePalette = {
  _type: 'sanity.imagePalette'
  darkMuted?: SanityImagePaletteSwatch
  lightVibrant?: SanityImagePaletteSwatch
  darkVibrant?: SanityImagePaletteSwatch
  vibrant?: SanityImagePaletteSwatch
  dominant?: SanityImagePaletteSwatch
  lightMuted?: SanityImagePaletteSwatch
  muted?: SanityImagePaletteSwatch
}

export type SanityImagePaletteSwatch = {
  _type: 'sanity.imagePaletteSwatch'
  background?: string
  foreground?: string
  population?: number
  title?: string
}

export type SanityImageDimensions = {
  _type: 'sanity.imageDimensions'
  height?: number
  width?: number
  aspectRatio?: number
}

export type SanityImageHotspot = {
  _type: 'sanity.imageHotspot'
  x?: number
  y?: number
  height?: number
  width?: number
}

export type SanityImageCrop = {
  _type: 'sanity.imageCrop'
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type SanityImageMetadata = {
  _type: 'sanity.imageMetadata'
  location?: Geopoint
  dimensions?: SanityImageDimensions
  palette?: SanityImagePalette
  lqip?: string
  blurHash?: string
  hasAlpha?: boolean
  isOpaque?: boolean
}

export type Geopoint = {
  _type: 'geopoint'
  lat?: number
  lng?: number
  alt?: number
}

export type SanityImageObject = {
  asset?: {
    _ref: string
    _type: 'reference'
    _weak?: boolean
    // [internalGroqTypeReferenceTo]?: 'sanity.imageAsset'
  } | SanityImageAsset
  media?: unknown
  hotspot?: SanityImageHotspot
  crop?: SanityImageCrop
  _type: 'image'
}

export type SanityImageAsset = {
  _id: string
  _type: 'sanity.imageAsset'
  _createdAt: string
  _updatedAt: string
  _rev: string
  originalFilename?: string
  label?: string
  title?: string
  description?: string
  altText?: string
  sha1hash?: string
  extension?: string
  mimeType?: string
  size?: number
  assetId?: string
  uploadId?: string
  path?: string
  url?: string
  metadata?: SanityImageMetadata
  source?: SanityAssetSourceData
}

export type SanityFileObject = {
  asset?: {
    _ref: string
    _type: 'reference'
    _weak?: boolean
    [internalGroqTypeReferenceTo]?: 'sanity.fileAsset'
  }
  media?: unknown
  _type: 'file'
}

export type SanityFileAsset = {
  _id: string
  _type: 'sanity.fileAsset'
  _createdAt: string
  _updatedAt: string
  _rev: string
  originalFilename?: string
  label?: string
  title?: string
  description?: string
  altText?: string
  sha1hash?: string
  extension?: string
  mimeType?: string
  size?: number
  assetId?: string
  uploadId?: string
  path?: string
  url?: string
  source?: SanityAssetSourceData
}

export type SanityAssetSourceData = {
  _type: 'sanity.assetSourceData'
  name?: string
  id?: string
  url?: string
}

export type AllSanitySchemaTypes =
  | Language
  | CollectionDocument
  | StaticDocument
  | CollectionDocumentType
  | StaticDocumentType
  | CollectionDocumentStub
  | StaticDocumentStub
  | Project
  | Writing
  | Happening
  | Resource
  | TranslationGroup
  | Form
  | HomePage
  | AboutPage
  | Website
  | Link
  | Slug
  | LocalisedSlug
  | LocalisedString
  | LocalisedText
  | LocalisedPageBuilder
  | PortableText
  | BodyPortableText
  | BodyPortableTextBlock
  | AuxiliaryPortableText
  | PageBuilder
  | SanityImagePalette
  | SanityImagePaletteSwatch
  | SanityImageDimensions
  | SanityImageHotspot
  | SanityImageCrop
  | SanityImageMetadata
  | Geopoint
  | SanityImageObject
  | SanityImageAsset
  | SanityFileAsset
  | SanityAssetSourceData
export declare const internalGroqTypeReferenceTo: unique symbol