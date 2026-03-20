import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  {
    title: "Projects",
    href: "#projects",
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

  return (
    <footer className="py-16 md:py-24 border-t border-border/50 bg-background/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-[-1]"></div>
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
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary">
              <a
                href="https://github.com/rifolio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary">
              <a
                href="https://www.linkedin.com/in/vladyslav-horbatenko/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary">
              <a
                href="mailto:vladyslav.horbatenko.work@gmail.com"
                aria-label="Email"
              >
                <Mail className="size-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary">
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
          <p>
            © {new Date().getFullYear()} Vladyslav Horbatenko. All rights
            reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-foreground transition-colors"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}