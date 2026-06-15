import { useEffect, useRef, useState } from "react";

let initialized = false;

function initMermaid(mermaid) {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    theme: "base",
    themeVariables: {
      // Match the site's dark + orange palette
      background: "#0B0B0B",
      primaryColor: "#161616",
      primaryBorderColor: "#F59E0B",
      primaryTextColor: "#FAFAFA",
      secondaryColor: "#1F1F1F",
      tertiaryColor: "#161616",
      lineColor: "#F59E0B",
      textColor: "#D4D4D8",
      mainBkg: "#161616",
      nodeBorder: "#F59E0B",
      clusterBkg: "#0F0F0F",
      clusterBorder: "rgba(255,255,255,0.12)",
      titleColor: "#FAFAFA",
      edgeLabelBackground: "#0B0B0B",
      // Sequence diagrams
      actorBkg: "#161616",
      actorBorder: "#F59E0B",
      actorTextColor: "#FAFAFA",
      signalColor: "#D4D4D8",
      signalTextColor: "#D4D4D8",
      labelBoxBkgColor: "#161616",
      labelBoxBorderColor: "#F59E0B",
      labelTextColor: "#FAFAFA",
      noteBkgColor: "#1F1F1F",
      noteBorderColor: "rgba(255,255,255,0.12)",
      noteTextColor: "#D4D4D8",
      // Pie charts
      pie1: "#F59E0B",
      pie2: "#FBBF24",
      pie3: "#B45309",
      pie4: "#78716C",
      pie5: "#52525B",
      pieTitleTextColor: "#FAFAFA",
      pieSectionTextColor: "#0B0B0B",
      pieStrokeColor: "#0B0B0B",
      pieOuterStrokeColor: "rgba(255,255,255,0.12)",
      pieLegendTextColor: "#D4D4D8",
    },
  });
  initialized = true;
}

let idCounter = 0;

export default function Mermaid({ chart }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${idCounter++}`;

    import("mermaid")
      .then(({ default: mermaid }) => {
        initMermaid(mermaid);
        return mermaid.render(id, chart);
      })
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to render diagram");
      });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-destructive/40 bg-card p-4 mb-4 text-sm text-destructive">
        Mermaid error: {error}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-diagram my-6 flex justify-center overflow-x-auto rounded-lg border border-border/60 bg-card/40 p-4 [&_svg]:max-w-full [&_svg]:h-auto"
    />
  );
}
