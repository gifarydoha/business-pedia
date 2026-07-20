// app/types/settings.ts
// Derived normalized app settings stored in Pinia after fetching from the API.
import type { OrganizationInfo, SocialMedia, SeoMeta, PageContent, Widgets } from "./api";

export interface AppSettings {
  sid: string;
  org: OrganizationInfo;
  socialMedia: SocialMedia;
  primaryColor: string;
  secondaryColor: string;
  defaultLanguage: string;
  aboutContent: string;
  widgets: Widgets;
  homeSeoMeta: SeoMeta;
  homePageContent: PageContent;
}
