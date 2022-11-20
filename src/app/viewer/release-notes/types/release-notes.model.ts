export interface ReleaseNotesVM {
  releases: Release[];
}

export interface Release {
  richContent: string;
  date: string;
  open?: boolean;
  version: string;
}
