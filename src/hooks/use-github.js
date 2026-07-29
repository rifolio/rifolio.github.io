import { useEffect, useState } from "react";
import snapshot from "@/data/github.json";
import { fetchGithub, isStale } from "@/lib/github.js";

const USER = "rifolio";
const KEY = "gh-stats-v1";

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null; // no storage (private mode) or corrupt entry
  }
}

export function useGithub() {
  // Start from whichever is newer: the last browser fetch or the build-time
  // snapshot (ISO strings sort lexicographically, so a plain compare works).
  const [data, setData] = useState(() => {
    const cached = readCache();
    return cached?.updatedAt > snapshot.updatedAt ? cached : snapshot;
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isStale(data)) return; // fetched within the last hour, leave it alone
    let active = true;
    setRefreshing(true);
    fetchGithub(USER)
      .then((fresh) => {
        try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch { /* no storage */ }
        if (active) setData(fresh);
      })
      .catch(() => {}) // rate-limited or offline: keep what we have, timestamp stays honest
      .finally(() => { if (active) setRefreshing(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, refreshing };
}
