import type { UserProfile, ProfileFormState } from "../types/profile";

export const defaultUser: UserProfile = {
  name: "Dr. Amara Osei",
  email: "amara.osei@northsouth.edu",
  userId: "USR-2023-04817",
  affiliation: "North South University, Dhaka",
  country: "Bangladesh",
  bio: "Associate Professor of Economics with a focus on social business frameworks, microfinance, and SDG-aligned enterprise models in developing economies. Active researcher and peer reviewer for SBAC since 2019.",
  avatarInitials: "AO",
  joined: "March 2021",
  papers: 3,
  track: "Finance & the SDGs",
};

export const defaultProfileFormState: ProfileFormState = {
  name: "Dr. Amara Osei-Bonsu",
  email: "amara.osei@northsouth.edu",
  userId: "USR-2023-04817",
  affiliation: "North South University, Dhaka",
  country: "Bangladesh",
  bio: "Associate Professor of Economics with a focus on social business frameworks, microfinance, and SDG-aligned enterprise models in developing economies. Active researcher and peer reviewer for SBAC since 2019.",
  customFields: [],
};

export const countries = [
  "Bangladesh", "Germany", "United Kingdom", "United States", "India",
  "Canada", "Australia", "France", "Japan", "Brazil", "Other",
];
