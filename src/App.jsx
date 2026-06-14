import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ChevronDown,
  FileText,
  X,
  ArrowLeft,
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
import FooterSection from "@/components/ui/footer";
import { LogosSection } from "@/components/ui/logos-section";
import "./App.css";

// Animated stat counter — counts up when scrolled into view
function AnimatedStat({ value, suffix = "", label, sub }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(Math.round(v));
      },
    });
    return controls.stop;
  }, [isInView, value]);

  return (
    <div ref={ref} className="py-4 text-center lg:text-left">
      <div className="font-display-hero text-4xl sm:text-5xl font-bold tabular-nums text-foreground leading-none">
        {value >= 1000 ? display.toLocaleString() : display}
        {suffix}
      </div>
      <div className="text-sm font-medium text-foreground/70 mt-2">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

// Returns true when a project has a real cover image
function hasCover(project) {
  return (
    project.coverImage &&
    !String(project.coverImage).startsWith("/api/placeholder")
  );
}

// Minimal typographic cover for projects without an image
function ProjectCoverFallback({ project, className }) {
  const initials = (project.company || project.title)
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-white/[0.015] ${className || ""}`}
    >
      <span className="font-display-hero text-5xl font-semibold text-white/[0.12] select-none leading-none">
        {initials}
      </span>
    </div>
  );
}

// Featured horizontal project card (first / flagship project) — flat, hairline
function FeaturedProjectCard({ project, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-4 sm:mb-5"
    >
      <div
        className="group relative rounded-xl border border-border overflow-hidden cursor-pointer transition-colors duration-300 hover:border-white/20"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && onClick?.()
        }
        aria-label={`View project: ${project.title}`}
      >
        <div className="grid md:grid-cols-[5fr_7fr]">
          {/* Visual side */}
          <div className="relative min-h-[180px] md:min-h-[300px] overflow-hidden border-b md:border-b-0 md:border-r border-border">
            {hasCover(project) ? (
              <img
                src={project.coverImage}
                alt={project.coverImageAlt || project.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ProjectCoverFallback project={project} />
            )}
            <div className="absolute top-4 left-4">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Featured
              </span>
            </div>
          </div>

          {/* Content side */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground mb-4">
                {project.company} · {project.year}
              </p>
              <h3 className="font-display text-2xl lg:text-3xl font-semibold mb-3 leading-tight tracking-tight">
                {project.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base max-w-md">
                {project.shortDescription}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-8">
                {project.tech.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md border border-border text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              View project
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Unified minimal project card — flat, hairline, no glass/gradient
function ProjectCard({ project, onClick }) {
  return (
    <div
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border cursor-pointer transition-colors duration-300 hover:border-white/20"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      aria-label={`View project: ${project.title}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        {hasCover(project) ? (
          <img
            src={project.coverImage}
            alt={project.coverImageAlt || project.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <ProjectCoverFallback project={project} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-2.5">
          {project.company || "Project"} · {project.year}
        </p>
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {project.shortDescription}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {project.tech?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded-md border border-border text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const navItems = [
  { id: "expertise", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "education", label: "Education" },
];

const expertiseDomains = [
  {
    name: "Language & Intelligence",
    skills: [
      "LLMs",
      "RAG",
      "DSPy",
      "LangChain",
      "LangGraph",
      "NLP",
      "Embeddings",
      "Prompt Engineering",
    ],
  },
  {
    name: "ML & Data Science",
    skills: [
      "PyTorch",
      "XGBoost",
      "Transformers",
      "Scikit-learn",
      "Pandas",
      "Computer Vision",
      "Optuna",
    ],
  },
  {
    name: "Cloud & Infrastructure",
    skills: [
      "AWS Bedrock",
      "Lambda",
      "DynamoDB",
      "Docker",
      "FastAPI",
      "CI/CD",
      "Pinecone",
      "Redis",
    ],
  },
  {
    name: "Full-Stack",
    skills: [
      "Django",
      "Next.js",
      "PostgreSQL",
      "React",
      "Celery",
      "Traefik",
      "GitHub Actions",
    ],
  },
];

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  // Lock background scroll when a project modal is open
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    if (selectedProject) {
      scrollYRef.current = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflowY = "scroll";
      root.style.scrollBehavior = "auto";
    } else {
      const top = body.style.top;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflowY = "";
      if (top) {
        const y = Math.abs(parseInt(top, 10)) || 0;
        window.scrollTo(0, y);
      }
      root.style.scrollBehavior = "";
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
    // Peermind
    {
      id: "peermind",
      title: "AI-Powered Educational Platform",
      shortDescription:
        "Full-stack educational platform with hybrid RAG, adaptive learning, and AI agents for students and teachers",
      fullDescription:
        "Architected and shipped a full-stack AI-powered educational platform end-to-end. Built with Django, Next.js, PostgreSQL, Redis, and Celery, with CI/CD via GitHub Actions and Dokploy. Features a multi-document preprocessing pipeline using VLMs, custom OCR and embedding models for semantic chunking and ToC detection. Implements hybrid RAG with Pinecone vector search, agentic multi-query retrieval via DSPy, and GraphRAG-style context assembly. Includes an adaptive learning system that generates personalized remediation content based on student quiz interactions, plus a Multimodal AI Tutor and ReAct page-editing agent with LangChain, LangGraph, and LangSmith observability.",
      features: [
        "Full-stack platform (Django, Next.js, PostgreSQL, Redis, Celery)",
        "CI/CD with GitHub Actions, Dokploy, Traefik, Caddy",
        "Multi-document preprocessing with VLMs, OCR, semantic chunking",
        "Hybrid RAG with Pinecone, DSPy agentic retrieval, GraphRAG-style assembly",
        "Adaptive learning system with personalized remediation content",
        "Multimodal AI Tutor with RAG, image analysis, streaming responses",
        "ReAct page-editing agent with LangChain, LangGraph, LangSmith",
        "Teacher analytics dashboard with engagement heatmaps and drop-off analysis",
      ],
      tech: [
        "Python",
        "Django",
        "Next.js",
        "DSPy",
        "LangChain",
        "LangGraph",
        "Pinecone",
        "PostgreSQL",
      ],
      company: "Peermind",
      year: "2025-Present",
      impact:
        "Shipped production AI platform for adaptive education with full observability and teacher analytics",
    },

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
        "83% reduction in average response time",
        "Handles 74% of all inbound inquiries (~10,500/month)",
        "Multi-turn dialogue capabilities",
        "Real-time response generation",
        "Comprehensive analytics and monitoring",
        "Agentic Trip Search Engine",
        "FNN model for ticket-price change durations using 70M+ flight records",
        "Internal automation for customer support (emails, guidelines, notifications)",
      ],
      tech: ["Python", "LLMs", "FastAPI", "AWS", "NLP"],
      company: "Tryp.com",
      companyUrl: "https://www.tryp.com",
      year: "2024-Present",
      coverImage: coverSandra,
      coverImageAlt: "Tryp.com AI customer support chatbot (Sandra)",
      impact:
        "Transformed customer support operations with significant cost savings and improved user experience",
    },

    // CoreAI / Bevar
    {
      id: "refugee-assistant",
      title: "AI Assistant for Refugees",
      shortDescription:
        "Multilingual AI chatbot on AWS providing 24/7 social support and booking integration",
      fullDescription:
        "A comprehensive AI assistant system designed to provide multilingual social support for refugees. Built on AWS Bedrock with a microservice architecture, the system offers 24/7 availability across multiple communication channels. The platform integrates advanced RAG capabilities with real-time booking systems to provide practical assistance and emotional support. Serves Danish social help, higher education, and Swedish migration support, with other Nordic regions in development.",
      features: [
        "24/7 multilingual social support",
        "AWS Bedrock integration",
        "Microservice architecture with Lambda and DynamoDB",
        "RAG pipeline for contextual responses",
        "Telegram and WhatsApp frontend integration",
        "EasyWeek API booking integration",
        "Danish social help, higher education, Swedish migration support",
        "Other Nordic regions in development",
        "Co-authored AWS Machine Learning Blog post",
      ],
      tech: ["AWS", "Lambda", "DynamoDB", "RAG", "Telegram", "WhatsApp", "Bedrock"],
      company: "CoreAI / Bevar Ukraine",
      companyUrl: "https://www.bevarukraine.dk/",
      year: "2025-Present",
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
        "A comprehensive research-focused pipeline for extracting tables from PDFs using state-of-the-art DETR-based models (Table Transformer). Developed as part of my Bachelor thesis at Novo Nordisk to automate the extraction of structured data from pharmaceutical documents. The system combines computer vision, deep learning, and OCR technologies to achieve high-precision table detection and structure recognition.",
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

    // Teacher Assistant
    {
      id: "teacher-assistant",
      title: "Teaching Assistant — Java Programming",
      shortDescription:
        "Guided 52 students on debugging, problem-solving, and coding practices",
      fullDescription:
        "Teacher Assistant for a Java programming course at Roskilde University. Guided 52 students on debugging, problem-solving, and coding practices. Provided feedback and grading on weekly homework assignments.",
      features: [
        "Guided 52 students on debugging and problem-solving",
        "Weekly homework feedback and grading",
        "Java programming course support",
      ],
      tech: ["Java", "Teaching"],
      company: "Roskilde University",
      companyUrl: "https://ruc.dk",
      year: "2024",
      impact: "Supported student learning in foundational programming course",
    },

    // Focolax
    {
      id: "api-integration",
      title: "API Integration Platform",
      shortDescription:
        "Automated CRM data integration using BERT AI and intelligent schema matching",
      fullDescription:
        "An intelligent API integration platform designed to automate CRM data synchronization across multiple platforms. The system uses BERT AI for semantic schema matching and REGEX for pattern recognition, enabling seamless data flow between different business systems. Includes a conversational chatbot interface for enhanced user interaction.",
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

    // Podcast prediction
    {
      id: "podcast-prediction",
      title: "Podcast Watch Time Prediction",
      shortDescription:
        "ML models predicting podcast engagement using XGBoost and advanced feature engineering",
      fullDescription:
        "A comprehensive data science project focused on predicting podcast listening time using machine learning techniques. The project involved extensive exploratory data analysis, feature engineering, and model optimization to understand and predict user engagement patterns in podcast consumption.",
      features: [
        "Predictive modeling with XGBoost and Linear Regression",
        "Advanced feature engineering and EDA",
        "Optuna optimization for hyperparameter tuning",
        "Kaggle competition dataset analysis",
        "Comprehensive statistical analysis",
        "Model performance evaluation and comparison",
      ],
      tech: ["Python", "XGBoost", "Optuna", "Data Science", "Pandas", "Scikit-learn"],
      year: "2025",
      github: "https://github.com/rifolio/PodcastWatchTimePrediction",
      coverImage: coverPodcast,
      coverImageAlt: "Podcast watch time prediction",
      company: "Roskilde University",
      companyUrl: "https://ruc.dk",
      impact:
        "Delivered insights for content planning and user engagement optimization",
    },

    // Fruit flies
    {
      id: "statistical-models",
      title: "Statistical Analysis of Fruit Fly Fecundity",
      shortDescription:
        "Advanced statistical modeling using ANOVA and post-hoc tests for genetic research",
      fullDescription:
        "A rigorous statistical analysis project exploring the fecundity of fruit flies (Drosophila melanogaster) across different genetic lines. The study employed advanced statistical methods including one-way ANOVA and Tukey's HSD post-hoc tests to investigate differences between DDT-resistant, DDT-susceptible, and control strains.",
      features: [
        "One-way ANOVA analysis across genetic lines",
        "Tukey's HSD Post-Hoc Test for pairwise comparisons",
        "T-Test statistical comparisons",
        "Analysis of three genetic lines (RS, SS, NS)",
        "Comprehensive statistical report with visualizations",
        "Collaborative research methodology",
      ],
      tech: ["Python", "Statistical Analysis", "Jupyter Notebook", "Data Visualization"],
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
          className="bg-card border border-border/80 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide shadow-lg shadow-foreground/5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border/60 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2 shrink-0" />
              Back
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
            >
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
                      <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full mt-2 mr-3 flex-shrink-0" />
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
                      className="px-3 py-1 border border-border text-muted-foreground text-sm rounded-md"
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
      <div className="relative z-10">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="section-wrap sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl safe-px">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-3 sm:py-4">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-display-hero text-base font-bold tracking-tight text-foreground hover:text-primary transition-colors"
            >
              VH
            </button>
            <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="nav-item hover:text-foreground transition-colors"
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

        {/* ── Hero ───────────────────────────────────────────────────── */}
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
                Vladyslav
                <span className="block text-muted-foreground/55">
                  Horbatenko
                </span>
              </h1>

              {/* Specialty chips — replacing typewriter */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
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

              <button
                type="button"
                onClick={() => scrollToSection("expertise")}
                className="mt-12 hidden lg:flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Scroll
                <ChevronDown className="w-4 h-4 motion-safe:animate-bounce" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Logo cloud ─────────────────────────────────────────────── */}
        <LogosSection />

        {/* ── Expertise ──────────────────────────────────────────────── */}
        <section
          id="expertise"
          className="section-wrap py-16 sm:py-20 safe-px border-t border-border/40"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div className="mb-10 max-w-2xl" {...motionSafe}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Skills
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Areas of expertise
              </h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                From language model infrastructure to full-stack deployment.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {expertiseDomains.map((domain, i) => (
                <motion.div
                  key={domain.name}
                  className="expertise-domain-card"
                  {...motionSafe}
                  transition={{
                    ...motionSafe.transition,
                    delay: i * 0.07,
                  }}
                >
                  <h3 className="font-display text-sm font-semibold mb-4 text-foreground">
                    {domain.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 rounded-md text-muted-foreground border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects ───────────────────────────────────────────────── */}
        <section
          id="projects"
          className="section-wrap py-12 sm:py-16 safe-px border-t border-border/40"
        >
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

            {/* Featured project (first) */}
            <FeaturedProjectCard
              project={projects[0]}
              onClick={() => setSelectedProject(projects[0])}
            />

            {/* Remaining projects grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {projects.slice(1).map((project, index) => (
                <motion.div
                  key={project.id || index}
                  {...motionSafe}
                  transition={{
                    ...motionSafe.transition,
                    delay: Math.min(index * 0.05, 0.25),
                  }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Education ──────────────────────────────────────────────── */}
        <section
          id="education"
          className="section-wrap py-20 sm:py-28 safe-px border-t border-border"
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

            <div className="relative pl-8 sm:pl-10 border-l border-border space-y-12 sm:space-y-14">
              <motion.article {...motionSafe}>
                <div className="absolute w-2.5 h-2.5 rounded-full -left-[5.5px] mt-1.5 bg-primary" />
                <p className="text-xs tabular-nums text-muted-foreground mb-2 font-mono">
                  2025 — 2027
                </p>
                <h3 className="font-display text-xl font-semibold">
                  MSc, Human-Centered Artificial Intelligence
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  Technical University of Denmark (DTU)
                </p>
              </motion.article>

              <motion.article
                {...motionSafe}
                transition={{ ...motionSafe.transition, delay: 0.06 }}
              >
                <div className="absolute w-2.5 h-2.5 rounded-full -left-[5.5px] mt-1.5 bg-muted-foreground/40" />
                <p className="text-xs tabular-nums text-muted-foreground mb-2 font-mono">
                  2022 — 2025
                </p>
                <h3 className="font-display text-xl font-semibold">
                  BSc, Computer Science & Mathematics
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
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

        {/* ── Project modal ───────────────────────────────────────────── */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </div>
  );
}

export default App;
