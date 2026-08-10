export type PaperStatus = "Under Review" | "Accepted" | "Rejected" | "Draft";

export type Paper = {
  id: string;
  title: string;
  track: string;
  status: PaperStatus;
  submittedDate: string;
  abstract: string;
  authors: string;
  paper_file_name?: string;
};
