import type { Paper, PaperStatus } from "../types/paper";

export const mockPapers: Paper[] = [
  {
    id: "PAP-2023-001",
    title: "Microfinance as a Catalyst for SDG Achievement: Evidence from Rural Bangladesh",
    track: "Finance & the SDGs",
    status: "Accepted",
    submittedDate: "14 July 2023",
    abstract: "This paper examines the direct relationship between microfinance penetration and SDG indicator performance across 64 districts in Bangladesh, drawing on panel data from 2015–2022.",
    authors: "Dr. Amara Osei-Bonsu, Prof. Tariq Rahman",
  },
  {
    id: "PAP-2023-002",
    title: "Social Business Funds and Youth Entrepreneurship: A Comparative Study of Germany and Bangladesh",
    track: "Marketing & Entrepreneurship",
    status: "Under Review",
    submittedDate: "3 August 2023",
    abstract: "Drawing on 48 semi-structured interviews with social business fund recipients in two countries, this study identifies shared success factors and structural barriers to youth entrepreneurship.",
    authors: "Dr. Amara Osei-Bonsu",
  },
  {
    id: "PAP-2023-003",
    title: "Measuring Non-Financial Returns: A Framework for Social Business Impact Assessment",
    track: "Finance & the SDGs",
    status: "Rejected",
    submittedDate: "22 August 2023",
    abstract: "We propose a standardised impact measurement framework for social businesses, tested against 120 enterprises across South Asia and Europe, identifying key non-financial value dimensions.",
    authors: "Dr. Amara Osei-Bonsu, Dr. Kenji Nakamura, Ms. Fatima Al-Rashid",
  },
];

export const statusConfig: Record<PaperStatus, { bg: string; text: string; dot: string }> = {
  "Accepted": {
    bg: "bg-cfp-olive/10",
    text: "text-cfp-olive",
    dot: "bg-cfp-olive",
  },
  "Under Review": {
    bg: "bg-cfp-yellow/15",
    text: "text-amber-700",
    dot: "bg-cfp-yellow",
  },
  "Rejected": {
    bg: "bg-cfp-red/10",
    text: "text-cfp-red",
    dot: "bg-cfp-red",
  },
  "Draft": {
    bg: "bg-gray-100",
    text: "text-gray-500",
    dot: "bg-gray-400",
  },
};
