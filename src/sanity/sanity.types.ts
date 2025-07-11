// --- Base ---

export type Language = 'ar' | 'en'

type SanityDocumentBase = {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
  _rev: string
}

// --- Traits ---

interface IsTargetable {
  slug?: LocalisedSlug
}

interface IsFeaturable {
  __isFeaturable: true
}

interface HasTitle {
  title?: LocalisedString
}

interface HasContent {
  content?: LocalisedPageBuilder
  textLength?: Localise<number>
}

interface HasSimpleDate {
  date?: string
}

interface HasRichDate {
  startDate?: string
  startTime?: {
    hours?: string
    minutes?: string
  }
  timezone?: string
}

interface HasLocation {
  location?: LocalisedString
}

interface HasMeta {
  summary?: LocalisedText
  mainImage?: ResolvedSanityReference<SanityImage>
}

// --- Collection Documents ---

export type Project = SanityDocumentBase
  & IsTargetable
  & IsFeaturable
  & HasTitle
  & HasContent
  & HasSimpleDate
  & HasMeta
  & {
  _type: 'project'
}

export type Writing = SanityDocumentBase
  & IsTargetable
  & IsFeaturable
  & HasTitle
  & HasContent
  & HasSimpleDate
  & HasMeta
  & {
  _type: 'writing'
}

export type Happening = SanityDocumentBase
  & IsTargetable
  & IsFeaturable
  & HasTitle
  & HasContent
  & HasRichDate
  & HasLocation
  & HasMeta
  & {
  _type: 'happening'
}

export type Resource = SanityDocumentBase
  & IsTargetable
  & IsFeaturable
  & HasTitle
  & HasContent
  & HasSimpleDate
  & HasMeta
  & {
  _type: 'resource'
}

export type CollectionDocument =
  | Project
  | Writing
  | Happening
  | Resource

export type CollectionDocumentType = CollectionDocument['_type']

// --- Root Documents ---

export type AboutPage = SanityDocumentBase
  & IsTargetable
  & HasTitle
  & HasContent
  & {
  _type: 'aboutPage'
}

export type HomePage = SanityDocumentBase
  & {
  _type: 'homePage'
  featuredItems?: Array<ResolvedSanityReference<AnyFeaturableDocument>>
}

export type RootDocument = 
  | AboutPage
  | HomePage

export type RootDocumentType = RootDocument['_type']

// --- Derived Documents ---

export type AnyDocument =
  | CollectionDocument
  | RootDocument

export type AnyTargetableDocument = Extract<AnyDocument, IsTargetable>
export type AnyTargetableDocumentType = AnyTargetableDocument['_type']
export type AnyTargetableDocumentStub = Stub<AnyTargetableDocument>

export type AnyFeaturableDocument = Extract<AnyDocument, IsFeaturable>
export type AnyFeaturableDocumentType = AnyFeaturableDocument['_type']

export type AnyTitledDocument = Extract<AnyDocument, HasTitle>
export type AnyTitledDocumentType = AnyTitledDocument['_type']

export type AnyContentDocument = Extract<AnyDocument, HasContent>
export type AnyContentDocumentType = AnyContentDocument['_type']

export type AnySimplyDatedDocument = Extract<AnyDocument, HasSimpleDate>
export type AnySimplyDatedDocumentType = AnySimplyDatedDocument['_type']

export type AnyRichlyDatedDocument = Extract<AnyDocument, HasRichDate>
export type AnyRichlyDatedDocumentType = AnyRichlyDatedDocument['_type']

export type AnyLocationedDocument = Extract<AnyDocument, HasLocation>
export type AnyLocationedDocumentType = AnyLocationedDocument['_type']

export type AnyMetaedDocument = Extract<AnyDocument, HasMeta>
export type AnyMetaedDocumentType = AnyMetaedDocument['_type']

// --- System Documents ---

export type Website = SanityDocumentBase
  & {
  _type: 'website'
  title?: LocalisedString
  summary?: LocalisedText
  keywords?: Array<string>
  logo?: ResolvedSanityReference<SanityImage>
  mainImage?: ResolvedSanityReference<SanityImage>
  analytics?: string
}

export type Form = SanityDocumentBase
  & {
  _type: 'form'
  referenceName?: string
  endpoint?: string
  fields?: Array<{
    _key: string
    type?:
      | 'text'
      | 'textarea'
      | 'select'
      | 'checkbox'
      | 'hidden'
    label?: LocalisedString
    options?: Array<string>
    name?: string
    value?: string
  }>
  attributes?: Array<string>
}

// --- Portable Text Blocks ---

type PortableTextChild = {
  _key: string
  _type: 'span'
  text?: string
  marks?: Array<string>
}

type BodyPortableTextBlock = {
  _key: string
  _type: 'block'
  style?:
    | 'normal'
    | 'heading'
    | 'blockquote'
  listItem?:
    | 'bullet'
    | 'number'
  level?: number
  children?: Array<PortableTextChild>
  markDefs?: Array<
    | Link
  >
}

type AuxiliaryPortableTextBlock = {
  _key: string
  _type: 'block'
  style?: 'normal'
  listItem?: never
  level?: number
  children?: Array<PortableTextChild>
  markDefs?: Array<
    | Link
  >
}

export type PortableTextImageBlock = {
  _key: string
  _type: 'imageBlock'
  images?: Array<ResolvedSanityReference<SanityImage & { altText?: string }>>
  caption?: Array<AuxiliaryPortableTextBlock>
}

export type PortableTextVideoBlock = {
  _key: string
  _type: 'videoBlock'
  url?: string
  aspectRatio?: string
  caption?: Array<AuxiliaryPortableTextBlock>
}

export type PortableTextAudioBlock = {
  _key: string
  _type: 'audioBlock'
  file?: SanityFile
  caption?: Array<AuxiliaryPortableTextBlock>
}

export type PortableTextFormBlock = {
  form?: ResolvedSanityReference<Form>
  _type: 'formBlock'
  _key: string
}

export type PortableTextBlock =
  | BodyPortableTextBlock
  | PortableTextImageBlock
  | PortableTextVideoBlock
  | PortableTextAudioBlock
  | PortableTextFormBlock

// --- Schemas ---

export type Slug = {
  _type: 'slug'
  current?: string
  source?: string
}

export type LocalisedSlug = Localise<Slug>

export type LocalisedString = Localise<string>

export type LocalisedText = Localise<string>

export type PageBuilder = Array<PortableTextBlock>

export type LocalisedPageBuilder = Localise<PageBuilder>

export type Link = {
  _type: 'link'
  type?: 'external' | 'internal'
  internalTarget?: ResolvedSanityReference<AnyTargetableDocumentStub>
  externalTarget?: string
}

// Sanity Images and Assets

type Geopoint = {
  _type: 'geopoint'
  lat?: number
  lng?: number
  alt?: number
}

type SanityImagePaletteSwatch = {
  _type: 'sanity.imagePaletteSwatch'
  background?: string
  foreground?: string
  population?: number
  title?: string
}

type SanityImageDimensions = {
  _type: 'sanity.imageDimensions'
  height?: number
  width?: number
  aspectRatio?: number
}

type SanityImagePalette = {
  _type: 'sanity.imagePalette'
  darkMuted?: SanityImagePaletteSwatch
  lightVibrant?: SanityImagePaletteSwatch
  darkVibrant?: SanityImagePaletteSwatch
  vibrant?: SanityImagePaletteSwatch
  dominant?: SanityImagePaletteSwatch
  lightMuted?: SanityImagePaletteSwatch
  muted?: SanityImagePaletteSwatch
}

type SanityImageMetadata = {
  _type: 'sanity.imageMetadata'
  location?: Geopoint
  dimensions?: SanityImageDimensions
  palette?: SanityImagePalette
  lqip?: string
  blurHash?: string
  hasAlpha?: boolean
  isOpaque?: boolean
}

type SanityAssetSourceData = {
  _type: 'sanity.assetSourceData'
  name?: string
  id?: string
  url?: string
}

type SanityImageAsset = SanityDocumentBase & {
  _type: 'sanity.imageAsset'
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

type SanityImageHotspot = {
  _type: 'sanity.imageHotspot'
  x?: number
  y?: number
  height?: number
  width?: number
}

type SanityImageCrop = {
  _type: 'sanity.imageCrop'
  top?: number
  bottom?: number
  left?: number
  right?: number
}

type SanityFileAsset = SanityDocumentBase & {
  _type: 'sanity.fileAsset'
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

export type SanityImage = {
  _type: 'image'
  asset?: SanityReference<SanityImageAsset>
  hotspot?: SanityImageHotspot
  crop?: SanityImageCrop
}

export type SanityFile = {
  _type: 'file'
  asset?: SanityReference<SanityFileAsset>
}

// --- Utilities ---

type Localise<T> = {
  [L in Language]?: T
}

type SanityReference<T> =
  | T
  | {
      _ref: string
      _type: 'reference'
      _weak?: boolean
      __refTarget?: T extends { _type: infer U extends string } ? U : never
    }

type ResolvedSanityReference<T> = Extract<SanityReference<T>, T>

type Stub<T extends {
  _id: string
  _type: string
  slug?: LocalisedSlug
}> = Pick<T,
  | '_id'
  |'_type'
  | 'slug'
>