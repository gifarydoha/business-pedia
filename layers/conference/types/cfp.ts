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
