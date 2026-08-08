import type { CfpSettings } from "~~/layers/base/types/api";

export const CFP_MOCK: CfpSettings = {
  conferenceName: "13th Social Business Academia Conference 2026",
  edition: "13th",
  year: "2026",
  location: "Bangkok",
  tagline: "November 2026 · Bangkok",
  description:
    "Social business is about re-organising the world not only for a more prosperous future but also a more dignified survival. SBAC supports these aims through rigorous social business research and teaching — because the need for bold alternatives has never been greater. We invite academic papers, practitioner cases, and concept notes on any issues related to social business.",
  submissionDeadline: "31 January 2027",
  portalUrl: "http://socialbusinesspedia.com/sbac/2026",
  stats: [
    { val: "13th", label: "Annual Conference" },
    { val: "6", label: "Conference Tracks" },
    { val: "23+", label: "Paper Themes" },
    { val: "4", label: "Peer-Reviewed Contacts" },
  ],
  dates: [
    { label: "Submission Opens", date: "10 March 2026", urgent: false },
    {
      label: "Notification of Acceptance",
      date: "20 September 2026",
      urgent: false,
    },
    {
      label: "Camera-Ready Submission",
      date: "25 September 2026",
      urgent: false,
    },
    {
      label: "Deadline for Submissions",
      date: "31 January 2027",
      urgent: true,
    },
    { label: "Conference Days", date: "1–2 April 2027", urgent: false },
  ],
  tracks: [
    { label: "Health & Sport", icon: "🏥", tag: "Track 1" },
    { label: "Education", icon: "🎓", tag: "Track 2" },
    {
      label: "Technology & Artificial Intelligence",
      icon: "🤖",
      tag: "Track 3",
    },
    { label: "Finance & the SDGs", icon: "💹", tag: "Track 4" },
    { label: "Marketing & Entrepreneurship", icon: "📊", tag: "Track 5" },
    {
      label: "Environment, Disaster Management & Pollution Control",
      icon: "🌱",
      tag: "Track 6",
    },
  ],
  themes: [
    "Social business & COVID-19 pandemic",
    "Poverty and wealth concentration",
    "Sustainable development & climate change",
    "Achieving UN SDGs via social business",
    "Affordable healthcare for underserved populations",
    "Technology for unreachable communities",
    "Social business vs. CSR & social enterprise",
    "Innovative financing (bonds, crowdfunding, VC)",
    "Research & teaching methodologies",
    "Measurement of social impact",
    "Emerging management methodologies",
    "Social business and AI & robotics",
  ],
  principles: [
    {
      n: 1,
      text: "Business objective will be to overcome poverty, or one or more problems (such as education, health, technology access, and environment) which threaten people and society.",
      short: "Overcome Poverty & Social Problems",
    },
    {
      n: 2,
      text: "Financial and economic sustainability.",
      short: "Financial Sustainability",
    },
    {
      n: 3,
      text: "Investors get back their investment amount only; no dividend is given beyond investment money.",
      short: "No Dividend Beyond Investment",
    },
    {
      n: 4,
      text: "When investment amount is paid back, company profit stays with the company for expansion and improvement.",
      short: "Profit Reinvested for Growth",
    },
    {
      n: 5,
      text: "Gender sensitive and environmentally conscious.",
      short: "Gender & Environmentally Conscious",
    },
    {
      n: 6,
      text: "Workforce gets market wage with better working conditions.",
      short: "Fair Wages & Better Conditions",
    },
    { n: 7, text: "Do it with joy.", short: "Do It With Joy" },
  ],
  contacts: [
    {
      name: "Professor Cam Donaldson",
      title: "Yunus Chair & Distinguished Professor of Health Economics",
      affiliation: "Glasgow Caledonian University",
      email: "Cam.Donaldson@gcu.ac.uk",
    },
    {
      name: "Dr. Abdul Hannan Chowdhury",
      title: "Professor, School of Business and Economics",
      affiliation: "North South University",
      email: "hannan.chowdhury@northsouth.edu",
    },
    {
      name: "Ms. Nazneen Sultana",
      title: "Executive Vice Chairman",
      affiliation: "Grameen Communications",
      email: "nazneen@grameen.org",
    },
    {
      name: "Ms. Lamiya Morshed",
      title: "Executive Director",
      affiliation: "Yunus Centre",
      email: "lamiya@grameen.org",
    },
  ],
  peerReviewBlurb:
    "There will be a peer-review process to select submissions for oral presentation at the conference. Submissions can be in the form of an abstract or a full paper. However, if accepted as an abstract, a full written paper is expected to be submitted at a later date. Authors will be notified about the specific sessions in which their paper will be presented.\n\nAt least one author must register and be present at the conference to present the paper. If no author is available to present, the paper will be withdrawn from the presentation list. Please review the authors' instructions before submitting.",
  footerCopyright:
    "© 2026 Social Business Academia Conference. All rights reserved.",
  footerHostedBy: "Hosted by Yunus Centre",
  nextSteps: [
    {
      n: 1,
      title: "Acknowledgement email",
      detail:
        "You will receive an automated confirmation email within 24 hours of submission.",
    },
    {
      n: 2,
      title: "Assignment to reviewers",
      detail:
        "The Scientific Committee assigns your submission to two domain experts for double-blind peer review.",
    },
    {
      n: 3,
      title: "Review period",
      detail:
        "Reviewers evaluate originality, methodology, and relevance. Allow 4–6 weeks for a decision.",
    },
    {
      n: 4,
      title: "Decision notification",
      detail:
        "You will be notified of acceptance, revision request, or rejection by 20 September 2026.",
    },
    {
      n: 5,
      title: "Camera-ready submission",
      detail:
        "If accepted, submit your final formatted paper by 25 September 2026 along with registration confirmation.",
    },
  ],
};
