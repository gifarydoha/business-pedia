export interface CfpHeader {
  title: string;
  subtitle: string;
}

export interface CfpMeta {
  date: string;
  venue: string;
  coOrganizedBy: string;
  theme: string;
}

export interface CfpTrack {
  name: string;
  description: string;
}

export interface CfpDate {
  label: string;
  date: string;
  urgent: boolean;
}

export interface CfpContent {
  header: CfpHeader;
  meta: CfpMeta;
  overview: string[];
  tracks: CfpTrack[];
  dates: CfpDate[];
}

export interface CommitteeMember {
  name: string;
  title: string;
  email: string | null;
  isTrackChair: boolean;
}

export interface CommitteeGroup {
  trackName: string;
  members: CommitteeMember[];
}

/** Full parsed content for the /committee page. */
export interface CommitteeContent {
  coChairs: CommitteeMember[];
  groups: CommitteeGroup[];
}

/** Full parsed content for the /tracks page (just the track list). */
export type TracksContent = CfpTrack[];
