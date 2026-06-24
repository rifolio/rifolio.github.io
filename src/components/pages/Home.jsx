import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar.jsx";
import Hero from "@/components/sections/Hero.jsx";
import About from "@/components/sections/About.jsx";
import GithubStats from "@/components/sections/GithubStats.jsx";
import Experience from "@/components/sections/Experience.jsx";
import Education from "@/components/sections/Education.jsx";
import LatestWriting from "@/components/sections/LatestWriting.jsx";
import FooterSection from "@/components/ui/footer";

function Home() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <div className="min-h-screen page-canvas text-foreground overflow-x-hidden relative z-0">
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Education />
          <GithubStats />
          <LatestWriting />
        </main>
        <FooterSection />
      </div>
    </div>
  );
}

export default Home;
