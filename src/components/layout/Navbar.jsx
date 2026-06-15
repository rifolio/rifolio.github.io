import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { navItems } from "@/data/site.js";

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="section-wrap sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl safe-px">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-3 sm:py-4">
        <Link
          to="/"
          className="font-display-hero text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          VH
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {navItems.map(({ id, label }) => (
            <Link
              key={id}
              to={`/#${id}`}
              className="nav-item hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/blog"
            className="nav-item hover:text-foreground transition-colors"
          >
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileNavOpen((o) => !o)}
            aria-expanded={mobileNavOpen}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {mobileNavOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 safe-px py-4 flex flex-col gap-1">
          {navItems.map(({ id, label }) => (
            <Link
              key={id}
              to={`/#${id}`}
              onClick={() => setMobileNavOpen(false)}
              className="text-left py-2.5 text-sm text-foreground"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/blog"
            onClick={() => setMobileNavOpen(false)}
            className="text-left py-2.5 text-sm text-foreground"
          >
            Blog
          </Link>
        </div>
      )}
    </header>
  );
}
