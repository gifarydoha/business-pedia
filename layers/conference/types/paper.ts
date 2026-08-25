export type PaperStatus = "Under Review" | "Accepted" | "Rejected" | "Draft";

export type Paper = {
  id: string;
  paper_code?: string;
  title: string;
  track: string;
  keywords?: string;
  is_has_permission_to_publish?: string | number | boolean;
  status: PaperStatus;
  current_status?: string;
  created?: string;
  updated?: string;
  final_decision?: string;
  submittedDate: string;
  abstract: string;
  authors: string;
  paper_file_name?: string;
};
