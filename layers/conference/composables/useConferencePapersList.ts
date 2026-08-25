import { ref, computed, type Ref } from "vue";
import type { Paper, RawPaper } from "~/layers/conference/types/paper";

export function useConferencePapersList(rawPapers: Ref<unknown>) {
  const papers = computed<Paper[]>(() => {
    const response = rawPapers.value as { conference_papers?: RawPaper[] } | null;
    if (!response?.conference_papers) return [];

    return response.conference_papers.map((p) => {
      return {
        ...p,
        id: String(p.id),
        paper_code: p.paper_code,
        title: p.title || "Untitled",
        abstract: p.abstract || "No abstract provided.",
        track: p.conference_track_name || "Uncategorized",
        keywords: p.keywords,
        is_has_permission_to_publish: p.is_has_permission_to_publish,
        current_status: p.current_status,
        created: p.created,
        updated: p.updated,
        final_decision: p.final_decision,
        paper_file_name: p.paper_file_name,
        submittedDate: p.created || "Unknown Date",
        authors: Array.isArray(p.authors)
          ? p.authors
            .filter((a) => String(a.is_corresponding_author) === "1" || a.is_corresponding_author === true)
            .map((a) => `${a.first_name || ""} ${a.last_name || ""}`.trim())
            .join(", ") || p.authors.map((a) => `${a.first_name || ""} ${a.last_name || ""}`.trim()).join(", ")
          : "Unknown Authors",
      } as Paper;
    });
  });

  const preview = ref<Paper | null>(null);
  const pdfPreviewUrl = ref<string | null>(null);

  return {
    papers,
    preview,
    pdfPreviewUrl,
  };
}
