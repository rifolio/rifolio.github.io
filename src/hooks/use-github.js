import { useEffect, useState } from "react";
import snapshot from "@/data/github.json";
import { shapeGithubData } from "@/lib/github.js";

const USER = "rifolio";

export function useGithub() {
  const [data, setData] = useState(snapshot);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    setRefreshing(true);
    fetch(`https://api.github.com/users/${USER}`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("rate-limited"))))
      .then((user) => {
        if (!active) return;
        // keep snapshot's stars + contributions (not in this endpoint), refresh the rest
        setData((prev) => shapeGithubData({
          user,
          starsTotal: prev.stars,
          contributions: { total: prev.contributionsTotal, weeks: prev.weeks },
          updatedAt: new Date().toISOString(),
        }));
      })
      .catch(() => {})
      .finally(() => active && setRefreshing(false));
    return () => { active = false; };
  }, []);

  return { data, refreshing };
}
