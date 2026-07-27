import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner.jsx";
import Home from "@/components/pages/Home.jsx";
import Blog from "@/components/pages/Blog.jsx";
import BlogPost from "@/components/pages/BlogPost.jsx";
import NotFound from "@/components/pages/NotFound.jsx";
import LoadingScreen from "@/components/layout/LoadingScreen.jsx";
import ScrollToHash from "@/components/layout/ScrollToHash.jsx";
import { unlockAchievement } from "@/lib/achievements.js";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

// Easter egg: Konami code toggles CRT scanline mode (see .crt in App.css)
function useKonami() {
  useEffect(() => {
    let i = 0;
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = key === KONAMI[i] ? i + 1 : key === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        const on = document.documentElement.classList.toggle("crt");
        toast(on ? "▚ CRT MODE ON — welcome to 1986" : "▚ CRT MODE OFF", {
          className: "font-pixel text-[10px]",
        });
        if (on) unlockAchievement("crt");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

// Easter egg: the tab misses you while you're away
function useLonelyTab() {
  useEffect(() => {
    let saved = document.title;
    const onVis = () => {
      if (document.hidden) {
        saved = document.title;
        document.title = "vh:~$ come back _";
      } else {
        document.title = saved;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (document.hidden) document.title = saved;
    };
  }, []);
}

export default function App() {
  useKonami();
  useLonelyTab();
  return (
    <>
      <ScrollToHash />
      <LoadingScreen />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
      {/* Easter egg: the only thing that survives Cmd+P (see @media print in App.css) */}
      <div className="print-egg hidden">
        ❯ why print a website? email me instead:
        vladyslav.horbatenko.work@gmail.com
      </div>
    </>
  );
}
