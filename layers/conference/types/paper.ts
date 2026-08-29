export type Paper = {
  id: string;
  paper_code?: string;
  title: string;
  track: string;
  keywords?: string;
  is_has_permission_to_publish?: string | number | boolean;
  current_status?: string;
  created?: string;
  updated?: string;
  final_decision?: string;
  submittedDate: string;
  abstract: string;
  authors: string;
  paper_file_name?: string;
};

export interface RawAuthor {
  first_name?: string;
  last_name?: string;
  is_corresponding_author?: string | number | boolean;
}

export interface RawPaper {
  id: string;
  title: string;
  abstract: string;
  conference_track_name: string;
  paper_code?: string;
  keywords?: string;
  is_has_permission_to_publish?: string | number | boolean;
  current_status?: string;
  final_decision?: string;
  created?: string;
  updated?: string;
  paper_file_name?: string;
  authors: RawAuthor[];
  [key: string]: unknown;
}
