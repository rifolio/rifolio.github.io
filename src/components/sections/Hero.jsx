import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import profilePicture from "@/assets/photo.jpg";
import { socials } from "@/data/site.js";

const SPECIALTY_TAGS = ["AI Engineer", "LLM Systems", "RAG & Retrieval", "Cloud & MLOps"];

function Hero() {
  const cvHref = import.meta.env.BASE_URL + "CV.pdf";

  return (
    <section className="section-wrap min-h-[calc(100vh-3.5rem)] flex items-center safe-px safe-pt py-12 sm:py-16 pb-4 sm:pb-6">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-12 lg:gap-16 lg:items-center">
        {/* Left: Text */}
        <motion.div
          className="lg:col-span-7 order-2 lg:order-1 flex flex-col items-center text-center lg:items-start lg:text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Status badge */}
          <div className="status-badge">
            <span className="status-dot" />
            MSc @ DTU · Copenhagen, Denmark
          </div>

          {/* Name */}
          <h1 className="font-display-hero text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.95] mb-5">
            <span className="block">Vladyslav</span>
            <span className="block text-muted-foreground/55">Horbatenko</span>
          </h1>

          {/* Specialty chips */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
            {SPECIALTY_TAGS.map((tag) => (
              <span key={tag} className="specialty-chip">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-7">
            Building practical intelligent systems — NLP, retrieval, and
            cloud infrastructure — that hold up in production.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
            <Button
              variant="default"
              size="lg"
              asChild
              className="rounded-full px-6"
            >
              <a href={cvHref} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Résumé
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full px-6 border-border/70"
            >
              <a href={`mailto:${socials.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </a>
            </Button>
            <Button variant="ghost" size="lg" asChild className="rounded-full">
              <a href={socials.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="ghost" size="lg" asChild className="rounded-full">
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Right: Photo */}
        <motion.div
          className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center lg:items-end"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="relative">
            <img
              src={profilePicture}
              alt="Vladyslav Horbatenko"
              className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full object-cover ring-1 ring-white/10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
