import { motion } from "framer-motion";
import TerminalCard from "@/components/ui/terminal-card";
import { TextScramble } from "@/components/ui/text-scramble";

const motionSafe = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
};

/** Lines shown inside the 8-bit terminal panel */
const terminalLines = [
  { type: "comment", text: "# what I build" },
  { type: "input",   text: "ls ~/stack" },
  { type: "output",  text: "LLM Systems/" },
  { type: "output",  text: "RAG & Retrieval/" },
  { type: "output",  text: "Python ML Pipelines/" },
  { type: "output",  text: "Cloud & MLOps (AWS)/" },
  { type: "output",  text: "React Front-ends/" },
  { type: "comment", text: "" },
  { type: "comment", text: "# currently shipping" },
  { type: "input",   text: "git log --oneline -3" },
  { type: "output",  text: "a1b2c3 Adaptive RAG pipeline (DSPy)" },
  { type: "output",  text: "d4e5f6 LLM chatbot — 86% accuracy" },
  { type: "output",  text: "g7h8i9 AWS Bedrock multilingual bot" },
];

export default function About() {
  return (
    <section
      id="about"
      className="section-wrap py-16 sm:py-20 safe-px border-t border-border/40"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div className="mb-10 max-w-2xl" {...motionSafe}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
            About
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            <TextScramble
              text="What I build"
              triggerOnMount
              speed={28}
            />
          </h2>
        </motion.div>

        {/* Two-column layout: bio left, terminal right */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — bio */}
          <motion.div
            {...motionSafe}
            transition={{ ...motionSafe.transition, delay: 0.05 }}
            className="flex flex-col gap-5"
          >
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Building practical intelligent systems — NLP, retrieval, and
              cloud infrastructure — that hold up in production.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              I focus on the full journey from data and model selection through
              to deployed, observable services. My work spans LLM application
              design (RAG pipelines, agentic workflows), classical ML for
              structured data, and the cloud plumbing that keeps everything
              running at scale on AWS.
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Currently pursuing an MSc in Human-Centered AI at DTU while
              shipping production AI across education, travel, and social
              sectors.
            </p>

            {/* Skill chips consistent with hero */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "AI Engineer",
                "LLM Systems",
                "RAG & Retrieval",
                "Cloud & MLOps",
              ].map((tag) => (
                <span key={tag} className="specialty-chip">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — 8-bit terminal panel */}
          <motion.div
            {...motionSafe}
            transition={{ ...motionSafe.transition, delay: 0.12 }}
            className="w-full"
          >
            <TerminalCard
              title="~/vladyslav — zsh"
              lines={terminalLines}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
