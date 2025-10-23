import { NextResponse } from "next/server";

type ScrapeProgress = {
  running: boolean;
  startedAt: number; // epoch ms
  scraped: number;
  added: number;
  updated: number;
  lastUserId: string;
};

function getProgress(): ScrapeProgress {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!globalThis.__SCRAPE_PROGRESS__) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__SCRAPE_PROGRESS__ = {
      running: false,
      startedAt: 0,
      scraped: 0,
      added: 0,
      updated: 0,
      lastUserId: "",
    } as ScrapeProgress;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return globalThis.__SCRAPE_PROGRESS__ as ScrapeProgress;
}

export async function GET() {
  const progress = getProgress();
  const now = Date.now();
  const elapsedMs = progress.startedAt > 0 ? Math.max(0, now - progress.startedAt) : 0;
  return NextResponse.json({ ...progress, elapsedMs });
}


