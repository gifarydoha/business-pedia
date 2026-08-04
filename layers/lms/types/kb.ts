export interface KbListItem {
  id: string;
  category_id: string;
  sub_category_id: string;
  category_name: string;
  sub_category_name: string;
  tag: string;
  title: string;
  alias: string;
  meta_title: string;
  meta_description: string;
  featured_image: string; // filename only — prefix with https://autofymind.com/fdrives/skb/
  details: string; // raw HTML
  total_view: string;
  created: string;
  is_featured: string;
}

export interface KbDetailItem extends KbListItem {
  // Contains full HTML with quote-block / highlight / pull-quote
  // divs and a [#FEATURED_MEDIA#] placeholder
}

export interface H2Entry {
  text: string;
  h_id: string;
}

export interface KbListResponse {
  kb_titles: KbListItem[];
}

export interface KbDetailResponse {
  kb_title: KbDetailItem;
  h2?: Record<string, H2Entry>;
}

export interface KbCategory {
  category_id: string;
  name: string;
  slug: string;
  count: number;
}
