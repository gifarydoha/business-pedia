// export type PresentationTrack
//   = | "Health & Sport"
//     | "Education"
//     | "Technology and Artificial Intelligence"
//     | "Finance and the SDGs"
//     | "Marketing and Entrepreneurship"
//     | "Environment, Disaster Management and Pollution Control"
//     | "Wealth Creation"
//     | "Peace and Justice"
//     | "Food Security";

export interface ConferenceTrack {
  id: number;
  name: string;
}

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
  track: number | "";
  // track: PresentationTrack | "";
  title: string;
  abstract: string;
  keywords: string;
  authors: SubmissionAuthor[];
  paperFile: File | null;
  existingPaperFileName: string | null;
  includeInProceedings: boolean | null;
}
