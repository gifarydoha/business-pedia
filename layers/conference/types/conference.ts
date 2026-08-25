export interface ConferenceTrack {
  id: string;
  name: string;
  alias: string | null;
  track_chair_name: string | null;
  track_chair_email: string | null;
  description: string;
  sort_order: string;
  is_active: string;
}

export interface ConferenceInitialResponse {
  code: number;
  conference_tracks: ConferenceTrack[];
  paper_statuses: Record<string, string>;
  final_decision_list: Record<string, string>;
  conference?: {
    id: string;
    conference_code: string;
    title: string;
    [key: string]: unknown;
  };
}
