import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ChevronDown,
  FileText,
  X,
  ArrowLeft,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import profilePicture from "./assets/photo.jpg";
import coverDeepLearning from "./assets/DeepLearningBSc.png";
import coverFruitFlies from "./assets/FruitFliesProject.png";
import coverBevar from "./assets/BevarVictor.png";
import coverFocolax from "./assets/Focolax.png";
import coverSandra from "./assets/Sandra.png";
import coverPodcast from "./assets/PodcastListenTime.png";
import { BGPattern } from "@/components/ui/bg-pattern";
import FooterSection from "@/components/ui/footer";
import { GlassBlogCard } from "@/components/ui/glass-blog-card-shadcnui";
import { LogosSection } from "@/components/ui/logos-section";
import "./App.css";

function Typewriter({
  phrases = [],
  typingDelayMs = 90,
  deletingDelayMs = 55,
  holdOnCompleteMs = 2200,
}) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    const fullText = phrases[currentPhraseIndex] || "";
    const isTyping = !isDeleting;

    let timeoutId;

    if (isTyping) {
      if (visibleText.length < fullText.length) {
        timeoutId = setTimeout(() => {
          setVisibleText(fullText.slice(0, visibleText.length + 1));
        }, typingDelayMs);
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), holdOnCompleteMs);
      }
    } else {
      if (visibleText.length > 0) {
        timeoutId = setTimeout(() => {
          setVisibleText(fullText.slice(0, visibleText.length - 1));
        }, deletingDelayMs);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [
    phrases,
    currentPhraseIndex,
    visibleText,
    isDeleting,
    typingDelayMs,
    deletingDelayMs,
    holdOnCompleteMs,
  ]);

  return (
    <span>
      <span>{visibleText}</span>
      <span className="typed-cursor typed-cursor--blink">|</span>
    </span>
  );
}

function readStoredTheme() {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const navItems = [
  { id: "projects", label: "Work" },
  { id: "education", label: "Education" },
];

function App() {
  const [isDark, setIsDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  // Lock background scroll when a project card (modal) is open
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    if (selectedProject) {
      scrollYRef.current = window.scrollY;
      // Prevent background scroll and preserve current position
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflowY = "scroll";
      // Avoid smooth scroll interference while locked
      root.style.scrollBehavior = "auto";
    } else {
      // Restore scroll position and styles
      const top = body.style.top;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflowY = "";
      root.style.scrollBehavior = "";
      if (top) {
        const y = Math.abs(parseInt(top, 10)) || 0;
        window.scrollTo(0, y);
      }
    }
  }, [selectedProject]);

  const scrollToSection = (sectionId) => {
    setMobileNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const projects = [
    // Tryp
    {
      id: "ai-chatbot",
      title: "AI Customer Support Chatbot",
      shortDescription:
        "LLM-powered chatbot achieving 86% accuracy and handling 10,500+ monthly inquiries",
      fullDescription:
        "A sophisticated AI-powered customer support system built using large language models to handle customer inquiries automatically. The chatbot demonstrates advanced natural language understanding and multi-turn dialogue capabilities, significantly improving response times and customer satisfaction. The system processes thousands of inquiries monthly while maintaining high accuracy rates.",
      features: [
        "86% intent recognition accuracy",
        "70% reduction in average response time",
        "Handles 51% of all inbound inquiries (~10,500/month)",
        "Multi-turn dialogue capabilities",
        "Real-time response generation",
        "Comprehensive analytics and monitoring",
        "Agentic Trip Search Engine",
      ],
      tech: ["Python", "LLMs", "FastAPI", "AWS", "NLP"],
      company: "Tryp.com",
      companyUrl: "https://www.tryp.com",
      year: "2024-2025",
      coverImage: coverSandra,
      coverImageAlt: "Tryp.com AI customer support chatbot (Sandra)",
      impact:
        "Transformed customer support operations with significant cost savings and improved user experience",
    },

    // Bevar
    {
      id: "refugee-assistant",
      title: "AI Assistant for Refugees",
      shortDescription:
        "Multilingual AI chatbot on AWS providing 24/7 social support and booking integration",
      fullDescription:
        "A comprehensive AI assistant system designed to provide multilingual social support for refugees. Built on AWS Bedrock with a microservice architecture, the system offers 24/7 availability across multiple communication channels. The platform integrates advanced RAG (Retrieval-Augmented Generation) capabilities with real-time booking systems to provide practical assistance and emotional support.",
      features: [
        "24/7 multilingual social support",
        "AWS Bedrock integration",
        "Microservice architecture with Lambda and DynamoDB",
        "RAG pipeline for contextual responses",
        "Telegram and WhatsApp frontend integration",
        "EasyWeek API booking integration",
      ],
      tech: [
        "AWS",
        "Lambda",
        "DynamoDB",
        "RAG",
        "Telegram",
        "WhatsApp",
        "Bedrock",
      ],
      company: "Bevar Ukraine",
      companyUrl: "https://www.bevarukraine.dk/",
      year: "2025",
      coverImage: coverBevar,
      coverImageAlt: "Bevar Ukraine AI assistant for refugees",
      impact:
        "Provided critical support services to refugee communities with scalable cloud infrastructure",
    },

    // Novo
    {
      id: "table-extractor",
      title: "Deep Learning-based Table Extraction from Pharmaceutical PDFs",
      shortDescription:
        "Fine-tuned transformer-based model for automated table extraction with 94% precision",
      fullDescription:
        "A comprehensive research-focused pipeline for extracting tables from PDFs using state-of-the-art DETR-based models (Table Transformer). This project was developed as part of my Bachelor thesis at Novo Nordisk to automate the extraction of structured data from pharmaceutical documents. The system combines computer vision, deep learning, and OCR technologies to achieve high-precision table detection and structure recognition.",
      features: [
        "PDF to table extraction using Table Transformer models",
        "Docker containerized application with Flask API",
        "Frontend interface for easy interaction",
        "OCR integration with EasyOCR",
        "Supports both table detection and structure recognition",
        "Comprehensive postprocessing pipeline",
      ],
      tech: [
        "Python",
        "PyTorch",
        "Transformers",
        "Computer Vision",
        "Flask",
        "Docker",
        "OCR",
      ],
      company: "Novo Nordisk",
      year: "2025",
      github: "https://github.com/rifolio/TableExtractorDETR",
      coverImage: coverDeepLearning,
      coverImageAlt: "Novo Nordisk table extraction project",
      impact:
        "Reduced manual processing time and improved data consistency for pharmaceutical document analysis",
    },

    // Focolax
    {
      id: "api-integration",
      title: "API Integration Platform",
      shortDescription:
        "Automated CRM data integration using BERT AI and intelligent schema matching",
      fullDescription:
        "An intelligent API integration platform designed to automate CRM data synchronization across multiple platforms. The system uses BERT AI for semantic schema matching and REGEX for pattern recognition, enabling seamless data flow between different business systems. The project included the development of a conversational chatbot interface for enhanced user interaction and system management.",
      features: [
        "Automated schema matching with BERT AI",
        "REGEX-based pattern recognition",
        "REST API integrations with HubSpot and ClickUp",
        "Telegram chatbot interface",
        "Real-time data synchronization",
        "Intelligent error handling and logging",
      ],
      tech: ["Python", "BERT", "REST API", "Telegram Bot", "NLP"],
      company: "Focalx",
      year: "2024",
      coverImage: coverFocolax,
      coverImageAlt: "Focalx API Integration Platform",
      impact: "Streamlined CRM workflows and reduced manual data entry by 80%",
    },

    // Rest
    {
      id: "podcast-prediction",
      title: "Podcast Watch Time Prediction",
      shortDescription:
        "ML models predicting podcast engagement using XGBoost and advanced feature engineering",
      fullDescription:
        "A comprehensive data science project focused on predicting podcast listening time using machine learning techniques. The project involved extensive exploratory data analysis, feature engineering, and model optimization to understand and predict user engagement patterns in podcast consumption. This work was completed as the final project for the Data Science course at RUC University.",
      features: [
        "Predictive modeling with XGBoost and Linear Regression",
        "Advanced feature engineering and EDA",
        "Optuna optimization for hyperparameter tuning",
        "Kaggle competition dataset analysis",
        "Comprehensive statistical analysis",
        "Model performance evaluation and comparison",
      ],
      tech: [
        "Python",
        "XGBoost",
        "Optuna",
        "Data Science",
        "Pandas",
        "Scikit-learn",
      ],
      year: "2025",
      github: "https://github.com/rifolio/PodcastWatchTimePrediction",
      coverImage: coverPodcast,
      coverImageAlt: "Podcast watch time prediction",
      company: "Roskilde University",
      companyUrl: "https://ruc.dk",
      impact:
        "Delivered insights for content planning and user engagement optimization",
    },
    {
      id: "statistical-models",
      title: "Statistical Analysis of Fruit Fly Fecundity",
      shortDescription:
        "Advanced statistical modeling using ANOVA and post-hoc tests for genetic research",
      fullDescription:
        "A rigorous statistical analysis project exploring the fecundity of fruit flies (Drosophila melanogaster) across different genetic lines. The study employed advanced statistical methods including one-way ANOVA and Tukey's HSD post-hoc tests to investigate differences between DDT-resistant, DDT-susceptible, and control strains. This collaborative research project achieved the highest grade and demonstrated proficiency in statistical modeling and hypothesis testing.",
      features: [
        "One-way ANOVA analysis across genetic lines",
        "Tukey's HSD Post-Hoc Test for pairwise comparisons",
        "T-Test statistical comparisons",
        "Analysis of three genetic lines (RS, SS, NS)",
        "Comprehensive statistical report with visualizations",
        "Collaborative research methodology",
      ],
      tech: [
        "Python",
        "Statistical Analysis",
        "Jupyter Notebook",
        "Data Visualization",
      ],
      year: "2024",
      github: "https://github.com/rifolio/StatisticalModels",
      coverImage: coverFruitFlies,
      coverImageAlt: "Statistical analysis of fruit fly fecundity",
      grade: "12 (Highest grade)",
      company: "Roskilde University",
      companyUrl: "https://ruc.dk",
      impact:
        "Contributed to understanding of genetic selection effects on reproductive fitness",
    },
  ];


  const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-card border border-border/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg shadow-foreground/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border/60 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2 shrink-0" />
              Back
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 sm:p-6 sm:pt-5">
            <div className="mb-6">
              <div className="w-full aspect-[3/2] bg-muted/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                {project.coverImage &&
                !String(project.coverImage).startsWith("/api/placeholder") ? (
                  <img
                    src={project.coverImage}
                    alt={project.coverImageAlt || project.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="px-4 text-center">
                    <span className="text-base sm:text-lg font-medium text-muted-foreground line-clamp-2">
                      {project.title}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 break-words">
                    {project.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground mb-2 sm:mb-4">
                    {project.company &&
                      (project.companyUrl ? (
                        <a
                          href={project.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {project.company}
                        </a>
                      ) : (
                        <span>{project.company}</span>
                      ))}
                    <span>{project.year}</span>
                    {project.grade && (
                      <span className="text-primary font-medium">
                        {project.grade}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full sm:w-auto"
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.impact && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Impact & Results
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.impact}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const cvHref = import.meta.env.BASE_URL + "CV.pdf";

  const motionSafe = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-48px" },
    transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
  };

  return (
    <div className="min-h-screen page-canvas text-foreground overflow-x-hidden relative z-0">
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
        <BGPattern variant="dots" mask="fade-bottom" className="opacity-[0.15]" fill="currentColor" size={20} />
      </div>
      <div className="relative z-10">
        <header className="section-wrap sticky top-0 z-40 border-b border-border/50 bg-background/75 backdrop-blur-xl safe-px">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-3 sm:py-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-display text-sm font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            VH
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </button>
            ))}
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
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="text-left py-2.5 text-sm text-foreground"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="section-wrap min-h-[calc(100vh-3.5rem)] flex items-center safe-px safe-pt py-12 sm:py-16 pb-4 sm:pb-6">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-12 lg:gap-16 lg:items-center">
          <motion.div
            className="lg:col-span-7 order-2 lg:order-1 flex flex-col items-center text-center lg:items-start lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Portfolio · Copenhagen
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-4">
              Vladyslav
              <span className="block text-muted-foreground">Horbatenko</span>
            </h1>
            <div className="text-lg sm:text-xl text-muted-foreground mb-4 min-h-[1.75rem]">
              <Typewriter
                phrases={[
                  "AI engineer",
                  "Human-centered systems",
                  "LLM applications",
                  "Data & ML",
                  "Cloud & automation",
                ]}
                typingDelayMs={75}
                deletingDelayMs={45}
              />
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-6">
              MSc in Human-Centered AI at DTU. I build practical intelligent
              systems—NLP, retrieval, and cloud infrastructure—that hold up in
              production.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
              <Button variant="default" size="lg" asChild className="rounded-full px-6">
                <a href={cvHref} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  Résumé
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full px-6 border-border/70">
                <a href="mailto:vladyslav.horbatenko.work@gmail.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild className="rounded-full">
                <a
                  href="https://github.com/rifolio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild className="rounded-full">
                <a
                  href="https://www.linkedin.com/in/vladyslav-horbatenko/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center lg:items-end"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/15 via-transparent to-accent/20 blur-2xl"
                aria-hidden
              />
              <img
                src={profilePicture}
                alt="Vladyslav Horbatenko"
                className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover ring-1 ring-border/80 shadow-2xl shadow-foreground/5"
              />
            </div>
            <div className="mt-4 flex items-center justify-center lg:justify-end gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 opacity-70" />
              <span>Copenhagen, Denmark</span>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection("projects")}
              className="mt-10 hidden lg:flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Scroll
              <ChevronDown className="w-4 h-4 motion-safe:animate-bounce" />
            </button>
          </motion.div>
        </div>
      </section>

      <LogosSection />

      {/* Projects */}
      <section id="projects" className="section-wrap py-12 sm:py-16 safe-px">
        <div className="max-w-6xl mx-auto">
          <motion.div className="mb-8 sm:mb-10 max-w-2xl" {...motionSafe}>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Selected work
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Projects that shipped
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Production AI, research-grade ML, and integrations across cloud
              and messaging surfaces.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[1fr] items-stretch">
            {projects.map((project, index) => (
              <motion.div
                key={project.id || index}
                {...motionSafe}
                transition={{
                  ...motionSafe.transition,
                  delay: Math.min(index * 0.04, 0.2),
                }}
                className="flex justify-center"
              >
                <GlassBlogCard
                  title={project.title}
                  excerpt={project.shortDescription}
                  image={
                    project.coverImage &&
                    !String(project.coverImage).startsWith("/api/placeholder")
                      ? project.coverImage
                      : undefined
                  }
                  author={
                    project.company
                      ? {
                          name: project.company,
                          avatar: project.coverImage || "",
                        }
                      : undefined
                  }
                  date={project.year}
                  tags={project.tech?.slice(0, 4) ?? []}
                  ctaLabel="View Project"
                  onClick={() => setSelectedProject(project)}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section
        id="education"
        className="section-wrap py-20 sm:py-28 safe-px bg-muted/20 border-t border-border/40"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="mb-12 max-w-2xl" {...motionSafe}>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Background
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Education
            </h2>
          </motion.div>
          <div className="relative pl-8 sm:pl-10 border-l border-border/70 space-y-12 sm:space-y-14">
            <motion.article {...motionSafe}>
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] mt-1.5 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <p className="text-xs tabular-nums text-muted-foreground mb-2 font-mono">
                2025 — 2027
              </p>
              <h3 className="font-display text-xl font-semibold">
                MSc, Human-Centered Artificial Intelligence
              </h3>
              <p className="text-sm text-primary mt-1 font-medium">
                Technical University of Denmark (DTU)
              </p>
            </motion.article>
            <motion.article {...motionSafe} transition={{ ...motionSafe.transition, delay: 0.06 }}>
              <div className="absolute w-3 h-3 bg-muted-foreground/40 rounded-full -left-[6.5px] mt-1.5" />
              <p className="text-xs tabular-nums text-muted-foreground mb-2 font-mono">
                2022 — 2025
              </p>
              <h3 className="font-display text-xl font-semibold">
                BSc, Computer Science & Mathematics
              </h3>
              <p className="text-sm text-primary mt-1 font-medium">
                Roskilde University (RUC)
              </p>
              <p className="text-muted-foreground text-sm mt-3 max-w-xl leading-relaxed">
                Focus on AI, machine learning, and mathematical modeling.
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      <FooterSection />

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      </div>
    </div>
  );
}

export default App;
