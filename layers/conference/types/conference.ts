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
  countries: Record<string, string>;
  conference?: {
    id: string;
    conference_code: string;
    country_id: string;
    title: string;
    start: string;
    all_day: string;
    is_more_than_one_day: string;
    end: string;
    paper_submission_start: string;
    full_paper_submission: string;
    acceptance_notification: string;
    camera_ready: string;
    venue: string;
    location: string;
    contact_person: string;
    contact_phone: string;
    description: string;
    logo: string | null;
    want_to_show_logo: string;
    image: string;
    want_to_show_banner: string;
    sort_order: string | null;
    current_status: string;
    active: string;
    is_approve: string;
  };
}
