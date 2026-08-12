// stores/cfp.ts
//
// Pinia store — per-session cache for all CFP-related content. Each `load*`
// action fetches + parses only once per session unless `force` is passed;
// components/pages read via getters, matching the pattern your existing
// Tracks/Dates components already use (settingsStore.cfpTracks etc.).

import { defineStore } from "pinia";
import { cfpService } from "~/services/cfpService";
import { parseCfpPageContent, parseTracksContent, parseCommitteeContent } from "~/utils/cfpParsers";
import type { CfpPageContent, CfpTrack, CommitteeContent } from "~/types/cfp";

interface CfpStoreState {
  callForPapers: CfpPageContent | null;
  tracks: CfpTrack[] | null;
  committee: CommitteeContent | null;
  loading: {
    callForPapers: boolean;
    tracks: boolean;
    committee: boolean;
  };
  errors: {
    callForPapers: string | null;
    tracks: string | null;
    committee: string | null;
  };
}

export const useCfpStore = defineStore("cfp", {
  state: (): CfpStoreState => ({
    callForPapers: null,
    tracks: null,
    committee: null,
    loading: { callForPapers: false, tracks: false, committee: false },
    errors: { callForPapers: null, tracks: null, committee: null },
  }),

  getters: {
    cfpHeader: (state) => state.callForPapers?.header ?? null,
    cfpMeta: (state) => state.callForPapers?.meta ?? null,
    cfpOverview: (state) => state.callForPapers?.overview ?? [],
    cfpDates: (state) => state.callForPapers?.dates ?? [],
    // The CFP page has its own embedded track summary — kept distinct from
    // the standalone /tracks page's independent content block.
    cfpEmbeddedTracks: (state) => state.callForPapers?.tracks ?? [],

    tracksList: (state) => state.tracks ?? [],

    committeeCoChairs: (state) => state.committee?.coChairs ?? [],
    committeeGroups: (state) => state.committee?.groups ?? [],
  },

  actions: {
    async loadCallForPapers(force = false) {
      if (this.callForPapers && !force) return;
      this.loading.callForPapers = true;
      this.errors.callForPapers = null;
      try {
        const html = await cfpService.fetchCallForPapers();
        this.callForPapers = parseCfpPageContent(html);
      }
      catch {
        this.errors.callForPapers = "Failed to load Call for Papers content.";
      }
      finally {
        this.loading.callForPapers = false;
      }
    },

    async loadTracks(force = false) {
      if (this.tracks && !force) return;
      this.loading.tracks = true;
      this.errors.tracks = null;
      try {
        const html = await cfpService.fetchTracks();
        this.tracks = parseTracksContent(html);
      }
      catch {
        this.errors.tracks = "Failed to load Tracks content.";
      }
      finally {
        this.loading.tracks = false;
      }
    },

    async loadCommittee(force = false) {
      if (this.committee && !force) return;
      this.loading.committee = true;
      this.errors.committee = null;
      try {
        const html = await cfpService.fetchCommittee();
        this.committee = parseCommitteeContent(html);
      }
      catch {
        this.errors.committee = "Failed to load Committee content.";
      }
      finally {
        this.loading.committee = false;
      }
    },
  },
});
