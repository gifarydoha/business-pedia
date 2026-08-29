// app/types/content.ts
// Re-exports and aliases for content-related types.
// The primary source of truth is app/types/api.ts.

export type { PageContent, HomePageBlock, SliderBlock, WidgetItem } from "./api";

// Known widget_element_path values from the API home_page_block widget
export type WidgetElementPath
  = | "courses"
    | "topics"
    | "questions"
    | "call_actions"
    | string; // Allow unknown paths for forward compatibility
