declare module 'radarr' {
  export interface OriginalLanguage {
    id: number;
    name: string;
  }

  export interface Language {
    id: number;
    name: string;
  }

  export interface AlternateTitle {
    id: number;
    sourceType: string;
    movieMetadataId: number;
    title: string;
    cleanTitle: string;
    sourceId: number;
    votes: number;
    voteCount: number;
    language: Language;
  }

  export interface Image {
    coverType: string;
    url: string;
    remoteUrl: string;
  }

  export interface AddOptions {
    ignoreEpisodesWithFiles: boolean;
    ignoreEpisodesWithoutFiles: boolean;
    monitor: string;
    searchForMovie: boolean;
    addMethod: string;
  }

  export interface Imdb {
    votes: number;
    value: number;
    type: string;
  }

  export interface Tmdb {
    votes: number;
    value: number;
    type: string;
  }

  export interface Metacritic {
    votes: number;
    value: number;
    type: string;
  }

  export interface RottenTomatoes {
    votes: number;
    value: number;
    type: string;
  }

  export interface Ratings {
    imdb: Imdb;
    tmdb: Tmdb;
    metacritic: Metacritic;
    rottenTomatoes: RottenTomatoes;
  }

  export interface Quality2 {
    id: number;
    name: string;
    source: string;
    resolution: number;
    modifier: string;
  }

  export interface Revision {
    version: number;
    real: number;
    isRepack: boolean;
  }

  export interface Quality {
    quality: Quality2;
    revision: Revision;
    hardcodedSubs: string;
  }

  export interface SelectOption {
    value: number;
    name: string;
    order: number;
    hint: string;
    dividerAfter: boolean;
  }

  export interface Field {
    order: number;
    name: string;
    label: string;
    unit: string;
    helpText: string;
    helpLink: string;
    type: string;
    advanced: boolean;
    selectOptions: SelectOption[];
    selectOptionsProviderAction: string;
    section: string;
    hidden: string;
    placeholder: string;
  }

  export interface Specification {
    id: number;
    name: string;
    implementation: string;
    implementationName: string;
    infoLink: string;
    negate: boolean;
    required: boolean;
    fields: Field[];
    presets: any[];
  }

  export interface CustomFormat {
    id: number;
    name: string;
    includeCustomFormatWhenRenaming: boolean;
    specifications: Specification[];
  }

  export interface MediaInfo {
    id: number;
    audioBitrate: number;
    audioChannels: number;
    audioCodec: string;
    audioLanguages: string;
    audioStreamCount: number;
    videoBitDepth: number;
    videoBitrate: number;
    videoCodec: string;
    videoDynamicRangeType: string;
    videoFps: number;
    resolution: string;
    runTime: string;
    scanType: string;
    subtitles: string;
  }

  export interface Language2 {
    id: number;
    name: string;
  }

  export interface MovieFile {
    id: number;
    movieId: number;
    relativePath: string;
    path: string;
    size: number;
    dateAdded: Date;
    sceneName: string;
    indexerFlags: number;
    quality: Quality;
    customFormats: CustomFormat[];
    mediaInfo: MediaInfo;
    originalFilePath: string;
    qualityCutoffNotMet: boolean;
    languages: Language2[];
    releaseGroup: string;
    edition: string;
  }

  export interface Image2 {
    coverType: string;
    url: string;
    remoteUrl: string;
  }

  export interface Image3 {
    coverType: string;
    url: string;
    remoteUrl: string;
  }

  export interface Imdb2 {
    votes: number;
    value: number;
    type: string;
  }

  export interface Tmdb2 {
    votes: number;
    value: number;
    type: string;
  }

  export interface Metacritic2 {
    votes: number;
    value: number;
    type: string;
  }

  export interface RottenTomatoes2 {
    votes: number;
    value: number;
    type: string;
  }

  export interface Ratings2 {
    imdb: Imdb2;
    tmdb: Tmdb2;
    metacritic: Metacritic2;
    rottenTomatoes: RottenTomatoes2;
  }

  export interface Language3 {
    id: number;
    name: string;
  }

  export interface AlternativeTitle {
    id: number;
    sourceType: string;
    movieMetadataId: number;
    title: string;
    cleanTitle: string;
    sourceId: number;
    votes: number;
    voteCount: number;
    language: Language3;
  }

  export interface Language4 {
    id: number;
    name: string;
  }

  export interface Translation {
    id: number;
    movieMetadataId: number;
    title: string;
    cleanTitle: string;
    overview: string;
    language: Language4;
  }

  export interface OriginalLanguage2 {
    id: number;
    name: string;
  }

  export interface Movie {
    id: number;
    tmdbId: number;
    images: Image3[];
    genres: string[];
    inCinemas: Date;
    physicalRelease: Date;
    digitalRelease: Date;
    certification: string;
    year: number;
    ratings: Ratings2;
    collectionTmdbId: number;
    collectionTitle: string;
    lastInfoSync: Date;
    runtime: number;
    website: string;
    imdbId: string;
    title: string;
    cleanTitle: string;
    sortTitle: string;
    status: string;
    overview: string;
    alternativeTitles: AlternativeTitle[];
    translations: Translation[];
    secondaryYear: number;
    youTubeTrailerId: string;
    studio: string;
    originalTitle: string;
    cleanOriginalTitle: string;
    originalLanguage: OriginalLanguage2;
    recommendations: number[];
    popularity: number;
    isRecentMovie: boolean;
  }

  export interface Collection {
    id: number;
    title: string;
    cleanTitle: string;
    sortTitle: string;
    tmdbId: number;
    overview: string;
    monitored: boolean;
    qualityProfileId: number;
    rootFolderPath: string;
    searchOnAdd: boolean;
    minimumAvailability: string;
    lastInfoSync: Date;
    images: Image2[];
    added: Date;
    movies: Movie[];
  }

  export interface RootObject {
    id: number;
    title: string;
    originalTitle: string;
    originalLanguage: OriginalLanguage;
    alternateTitles: AlternateTitle[];
    secondaryYear: number;
    secondaryYearSourceId: number;
    sortTitle: string;
    sizeOnDisk: number;
    status: string;
    overview: string;
    inCinemas: Date;
    physicalRelease: Date;
    digitalRelease: Date;
    physicalReleaseNote: string;
    images: Image[];
    website: string;
    remotePoster: string;
    year: number;
    hasFile: boolean;
    youTubeTrailerId: string;
    studio: string;
    path: string;
    qualityProfileId: number;
    monitored: boolean;
    minimumAvailability: string;
    isAvailable: boolean;
    folderName: string;
    runtime: number;
    cleanTitle: string;
    imdbId: string;
    tmdbId: number;
    titleSlug: string;
    rootFolderPath: string;
    folder: string;
    certification: string;
    genres: string[];
    tags: number[];
    added: Date;
    addOptions: AddOptions;
    ratings: Ratings;
    movieFile: MovieFile;
    collection: Collection;
    popularity: number;
  }
}
