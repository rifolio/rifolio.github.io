import { useEffect, useRef } from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unlockAchievement } from "@/lib/achievements.js";

const links = [
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Education",
    href: "#education",
  },
  {
    title: "Contact",
    href: "mailto:vladyslav.horbatenko.work@gmail.com",
  },
];

export default function FooterSection() {
  const cvHref = import.meta.env.BASE_URL + "CV.pdf";
  const exitLineRef = useRef(null);

  // Easter egg: reaching the very bottom is an achievement
  useEffect(() => {
    const el = exitLineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      unlockAchievement("bottom");
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="py-16 md:py-24 border-t border-border relative overflow-hidden">
      <div className="mx-auto max-w-5xl safe-px relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight mb-2">
              Vladyslav Horbatenko
            </h2>
            <p className="text-muted-foreground text-sm">
              AI Engineer & MSc Student at DTU
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <span>{link.title}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground">
              <a
                href="https://github.com/rifolio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground">
              <a
                href="https://www.linkedin.com/in/vladyslav-horbatenko/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground">
              <a
                href="mailto:vladyslav.horbatenko.work@gmail.com"
                aria-label="Email"
              >
                <Mail className="size-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground">
              <a
                href={cvHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume"
              >
                <FileText className="size-5" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40 text-xs text-muted-foreground">
          <p ref={exitLineRef} className="font-mono">
            <span className="text-primary/70 mr-1.5" aria-hidden="true">
              ❯
            </span>
            exit 0 — © {new Date().getFullYear()} Vladyslav Horbatenko
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono hover:text-foreground transition-colors"
          >
            cd /top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}