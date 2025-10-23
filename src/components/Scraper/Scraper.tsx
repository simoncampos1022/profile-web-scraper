"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProfileScraper() {
  const [ssoKey, setSsoKey] = useState("");
  const [susSession, setSusSession] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({
    running: false,
    elapsedMs: 0,
    scraped: 0,
    added: 0,
    updated: 0,
    lastUserId: "",
  });

  const handleScrapeOne = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/scrape-one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, ssoKey, susSession }),
      });

      if (!response.ok) toast.error("Failed to fetch profile");
      else toast.success("Profile fetched successfully");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssoKey, susSession }),
      });

      if (!response.ok) throw new Error("Failed to start scraping");
      const data = await response.json();
      if (data?.started) {
        setRunning(true);
        toast.success("Scrape started");
      }
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const poll = async () => {
      try {
        const res = await fetch("/api/scrape/status");
        if (!res.ok) return;
        const data = await res.json();
        setProgress(data);
        setRunning(Boolean(data?.running));
      } catch {}
    };
    if (running) {
      // start polling immediately and then every second
      poll();
      intervalId = setInterval(poll, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [running]);

  const handleStop = async () => {
    try {
      await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });
      setRunning(false);
      toast.info("Scrape stopped");
    } catch {}
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hh = hours > 0 ? String(hours).padStart(2, "0") + ":" : "";
    return `${hh}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          value={ssoKey}
          onChange={(e) => setSsoKey(e.target.value)}
          placeholder="Enter SSO Key"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          value={susSession}
          onChange={(e) => setSusSession(e.target.value)}
          placeholder="Enter SUS Session"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Startup School profile URL"
          className="flex-1 p-2 border rounded"
        />
      </div>
      <div className="flex flex-row justify-center items-center gap-4 mb-8">
        <button
          onClick={handleScrapeOne}
          disabled={running || loading || ssoKey === "" || susSession === "" || url === ""}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Scrape One"}
        </button>
        <button
          onClick={handleScrape}
          disabled={running || loading || ssoKey === "" || susSession === ""}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {running ? "Running..." : loading ? "Starting..." : "Scrape Many"}
        </button>
        {running && (
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            STOP
          </button>
        )}
      </div>
      {(running || progress.elapsedMs > 0) && (
        <div className="max-w-4xl mx-auto mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Elapsed</div>
            <div className="text-xl font-semibold">{formatDuration(progress.elapsedMs)}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Scraped</div>
            <div className="text-xl font-semibold">{progress.scraped}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Added</div>
            <div className="text-xl font-semibold">{progress.added}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-500">Updated</div>
            <div className="text-xl font-semibold">{progress.updated}</div>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
    </div>
  );
}
