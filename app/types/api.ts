// app/types/api.ts
// Full TypeScript interfaces matching the autofymind CodeIgniter REST API contract.

// ─────────────────────────────────────────────
// Top-level Settings API Response
// GET /website/website_api/settings?access_key=…
// ─────────────────────────────────────────────
export interface SettingsApiResponse {
  sid: string;
  version: number;
  page_content: PageContent;
  widgets: Widgets;
  sid_site: SidSite;
  seo_meta: SeoMeta;
  message: string;
  code: number;
}

// ─────────────────────────────────────────────
// Page Content
// Also returned by GET /website/website_api/content/{alias}?access_key=…
// ─────────────────────────────────────────────
export interface PageContent {
  id: string;
  alias: string;
  title: string;
  sub_title: string;
  fulltext: string;
  introtext: string;
  page_title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  url: string;
  image_url: string;
  is_featured_image: boolean;
  image_url_default: string;
  updated: string;
  created: string;
  publish_date: string;
  status: string;
  content_type: string;
  parent_id: string;
  main_category_id: string;
  category_title: string;
  page_setting: Record<string, unknown>;
  name?: string; // Author name
  profile_photo?: string | null;
}

/** Response shape for GET /content/{alias} */
export interface ContentApiResponse {
  page_content: PageContent;
  seo_meta: SeoMeta;
  widgets?: Partial<Widgets>;
  message: string;
  code: number;
}

// ─────────────────────────────────────────────
// Widget Item (shared across menu, slider, page_block, home_page_block items)
// ─────────────────────────────────────────────
export interface WidgetItem {
  id: string;
  parent_id: string;
  order: string;
  type: string;
  status: string;
  title: string;
  alias: string;
  label: string;
  link?: string;
  content_type: string;
  custom_content: string | null;
  content_id: string | null;
  content_category_id: string | null;
  image: string | null;
  level: number;
  parent: string;
  url: string;
  // Extra fields present on some item types:
  name?: string;
  sub_title?: string;
  fulltext?: string;
  image_url?: string;
  content_category_alias?: string;
  app_language_code?: string;
  media_info?: unknown[];
  // Nested menu children
  children?: WidgetItem[];
}

// ─────────────────────────────────────────────
// Home Page Block Widget Section
// ─────────────────────────────────────────────
export interface HomePageBlock {
  id: string;
  type: "home_page_block";
  widget_element_path: string; // e.g. "courses" | "topics" | "questions" | "call_actions"
  is_full_section: string; // "0" | "1"
  title: string;
  alias: string;
  description: string;
  content_selection_option: string;
  content_type_id: string;
  content_category_id: string;
  search_keywords: string;
  quantity: string;
  is_only_featured: string;
  website_widget_position_id: string | null;
  sort_order: string;
  status: string; // "1" = active
  created: string | null;
  updated: string | null;
  items: WidgetItem[];
}

// ─────────────────────────────────────────────
// Slider Widget Section
// ─────────────────────────────────────────────
export interface SliderBlock {
  id: string;
  type: "slider";
  widget_element_path: string;
  is_full_section: string;
  title: string;
  alias: string;
  description: string;
  content_selection_option: string;
  content_type_id: string;
  content_category_id: string;
  search_keywords: string;
  quantity: string;
  is_only_featured: string;
  sort_order: string;
  status: string;
  items: WidgetItem[];
}

// ─────────────────────────────────────────────
// All Widgets
// ─────────────────────────────────────────────
export interface Widgets {
  page_block: Record<string, WidgetItem[]>; // e.g. { list_page_banner: [...] }
  home_page_block: Record<string, HomePageBlock>; // indexed by numeric keys "0", "1", …
  slider: Record<string, SliderBlock>; // indexed by numeric keys "0", "1", …
  menu: Record<string, WidgetItem[]>; // e.g. { main_menu: [...] }
}

// ─────────────────────────────────────────────
// Organization & SidSite (subscription/theme data)
// ─────────────────────────────────────────────
export interface OrganizationInfo {
  "name": string;
  "company-brief": string;
  "website-url": string;
  "logo": string;
  "mobile": string;
  "hot-number": string;
  "contact-email": string;
  "address": string;
  "meta-title": string;
  "meta-keyword": string;
  "meta-description": string;
  "favicon": string;
  "location-map": string;
  "analytic-code": string;
  "hover_logo": string;
  "logo_description": string;
  "has_website": string;
}

export interface SocialMedia {
  messenger?: string;
  whatsapp?: string;
  phone1?: string;
  phone2?: string;
}

export interface SidSite {
  "app_setting": {
    organization_information: OrganizationInfo;
    social_media: SocialMedia;
    website_setting?: unknown;
    [key: string]: unknown;
  };
  "about_content": string;
  "invoice-initial": string;
  "invoice-digit": string;
  "default_language_code": string;
  "layout_primary_color": string; // e.g. "#266B88"
  "layout_secondary_color": string; // e.g. "#F7700B"
  "layout_alias": string;
  "template_alias": string;
  "theme_alias": string;
  "theme_type": string;
  "has_website": string;
  "urls": {
    logo_url: string;
    cover_image_url: string;
    cover_image_repeat?: string;
  };
}

// ─────────────────────────────────────────────
// SEO Meta
// ─────────────────────────────────────────────
export interface SeoMeta {
  meta_title: string;
  meta_keywords: string;
  meta_description: string;
  image_url: string;
  url: string;
  canonical_url: string;
}

// ─────────────────────────────────────────────
// Generic API helpers
// ─────────────────────────────────────────────
export type ApiResponse<T> = T & {
  message?: string;
  code?: number;
  success?: boolean;
};

export interface ApiListResponse<T> {
  data: T[];
  message: string;
  success: boolean;
  meta?: ApiMeta;
}

export interface ApiMeta {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
