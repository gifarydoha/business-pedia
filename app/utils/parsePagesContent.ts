import type { HTMLElement } from "node-html-parser";
import { parse } from "node-html-parser";

function text(el: HTMLElement | null | undefined): string {
  if (!el) return "";
  return el.textContent?.trim() ?? "";
}

export function parsePagesContent(fulltext: string) {
  let doc = parse(fulltext);
  let sections = doc.querySelectorAll("section");

  if (sections.length === 0) {
    let unescaped = doc.textContent;
    if (unescaped && unescaped.includes("<section>")) {
      // Remove ALL backslashes that the backend might have added (e.g. class=\"badge\")
      unescaped = unescaped.replace(/\\/g, "");

      doc = parse(unescaped);
      sections = doc.querySelectorAll("section");
    }
  }

  const heroSection = sections[0];
  const heroBadge = text(heroSection?.querySelector(".badge"));
  const heroTitle = text(heroSection?.querySelector("h1"));
  const heroLead = text(heroSection?.querySelector(".lead"));

  const introSection = sections[1];
  const introHeading = text(introSection?.querySelector("h2"));
  const introText = text(introSection?.querySelector("p"));

  const processSection = sections[2];
  const processHeading = text(processSection?.querySelector("h2"));
  const processSubtext = text(processSection?.querySelector("p.text-secondary"));
  const processCards = processSection?.querySelectorAll(".col-md-4 .card-body") ?? [];
  const processSteps = Array.from(processCards).map((card, i) => ({
    number: i + 1,
    title: text(card.querySelector("h5")),
    description: text(card.querySelector("p")),
  }));

  const pillarsSection = sections[3];
  const pillarsHeading = text(pillarsSection?.querySelector("h2"));
  const pillarsSubtext = text(pillarsSection?.querySelector("p.text-secondary"));
  const pillarCards = pillarsSection?.querySelectorAll(".card-body") ?? [];
  const pillars = Array.from(pillarCards).map((card) => ({
    title: text(card.querySelector("h5")),
    descriptor: text(card.querySelector("p")),
  }));

  const featuredSection = sections[4];
  const badgeEls = featuredSection?.querySelectorAll(".text-center .badge") ?? [];
  const featuredBadge = badgeEls.length > 0 ? text(badgeEls[0]) : "Most Special Course";
  const featuredHeading = text(featuredSection?.querySelector("h2"));
  const featuredCards = featuredSection?.querySelectorAll(".col-md-6 .card-body") ?? [];
  const featuredItems = Array.from(featuredCards).map((card, i) => ({
    badge: String(i + 1).padStart(2, "0"),
    title: text(card.querySelector("h4")),
    subtitle: text(card.querySelector("h6")),
    description: text(card.querySelector("p")),
  }));

  const contactSection = sections[5];
  const contactHeading = text(contactSection?.querySelector("h2"));
  const contactCols = contactSection?.querySelectorAll(".col-md-4") ?? [];
  const address = contactCols[0] ? text(contactCols[0].querySelector("p")) : "";
  const phone = contactCols[1] ? text(contactCols[1].querySelector("p")) : "";
  const email = contactCols[2] ? text(contactCols[2].querySelector("p")) : "";

  return {
    heroTitle,
    heroBadge,
    heroLead,
    introHeading,
    introText,
    processHeading,
    processSubtext,
    processSteps,
    pillarsHeading,
    pillarsSubtext,
    pillars,
    featuredBadge,
    featuredHeading,
    featuredItems,
    contactHeading,
    contact: { address, phone, email },
  };
}
