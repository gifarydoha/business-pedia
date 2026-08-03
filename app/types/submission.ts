export type PresentationTrack
  = | "Health & Sport"
    | "Education"
    | "Technology and Artificial Intelligence"
    | "Finance and the SDGs"
    | "Marketing and Entrepreneurship"
    | "Environment, Disaster Management and Pollution Control"
    | "Wealth Creation and Other Issues";

export interface SubmissionAuthor {
  id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  gender: "male" | "female" | "";
  email: string;
  country: string;
  organization: string;
  position: string;
  isCorrespondingAuthor: boolean;
}

export interface SubmissionFormData {
  track: PresentationTrack | "";
  title: string;
  abstract: string;
  keywords: string;
  authors: SubmissionAuthor[];
  paperFile: File | null;
  includeInProceedings: boolean | null;
}

export const CONFERENCE_TRACKS: PresentationTrack[] = [
  "Health & Sport",
  "Education",
  "Technology and Artificial Intelligence",
  "Finance and the SDGs",
  "Marketing and Entrepreneurship",
  "Environment, Disaster Management and Pollution Control",
  "Wealth Creation and Other Issues",
];

// Trim/extend as you like — static per your answer
export const COUNTRIES = [
  "Bangladesh", "India", "United Kingdom", "United States", "Germany",
  "Canada", "Australia", "Pakistan", "Nepal", "Sri Lanka", "Malaysia",
  "Singapore", "United Arab Emirates", "Saudi Arabia", "Other",
];
