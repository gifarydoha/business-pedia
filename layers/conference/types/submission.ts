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
  country: number | "";
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
  existingPaperFileName: string | null;
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
export interface Country {
  id: number;
  name: string;
}

export const COUNTRIES: Country[] = [
  { id: 1, name: "Bangladesh" },
  { id: 2, name: "India" },
  { id: 3, name: "United Kingdom" },
  { id: 4, name: "United States" },
  { id: 5, name: "Germany" },
  { id: 6, name: "Canada" },
  { id: 7, name: "Australia" },
  { id: 8, name: "Pakistan" },
  { id: 9, name: "Nepal" },
  { id: 10, name: "Sri Lanka" },
  { id: 11, name: "Malaysia" },
  { id: 12, name: "Singapore" },
  { id: 13, name: "United Arab Emirates" },
  { id: 14, name: "Saudi Arabia" },
  { id: 15, name: "Other" },
];
