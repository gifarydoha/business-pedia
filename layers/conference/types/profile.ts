export type CustomField = {
  id: number;
  label: string;
  value: string;
};

export type UserProfile = {
  name: string;
  email: string;
  userId: string;
  affiliation: string;
  country: string;
  bio: string;
  avatarInitials: string;
  joined: string;
  papers: number;
  track: string;
};

export type ProfileFormState = {
  name: string;
  email: string;
  userId: string;
  affiliation: string;
  country: string;
  bio: string;
  customFields: CustomField[];
};
