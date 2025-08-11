import { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
  FileText,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import profilePicture from "./assets/photo.jpg";
import coverDeepLearning from "./assets/DeepLearningBSc.png";
import coverFruitFlies from "./assets/FruitFliesProject.png";
import coverBevar from "./assets/BevarVictor.png";
import coverFocolax from "./assets/Focolax.png";
import coverSandra from "./assets/Sandra.png";
import coverPodcast from "./assets/PodcastListenTime.png";
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

function App() {
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const scrollToSection = (sectionId) => {
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
        "LLM-powered chatbot achieving 86% accuracy and handling 5,500+ monthly inquiries",
      fullDescription:
        "A sophisticated AI-powered customer support system built using large language models to handle customer inquiries automatically. The chatbot demonstrates advanced natural language understanding and multi-turn dialogue capabilities, significantly improving response times and customer satisfaction. The system processes thousands of inquiries monthly while maintaining high accuracy rates.",
      features: [
        "86% intent recognition accuracy",
        "70% reduction in average response time",
        "Handles 51% of all inbound inquiries (~5,500/month)",
        "Multi-turn dialogue capabilities",
        "Real-time response generation",
        "Comprehensive analytics and monitoring",
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

  const skills = {
    "Programming Languages": ["Python", "Java", "C#", "JavaScript"],
    "AI & ML": [
      "LLaMA AI",
      "OpenAI",
      "PyTorch",
      "TensorFlow",
      "Scikit Learn",
      "DSPy",
      "LangChain",
    ],
    "Cloud & DevOps": ["AWS", "GCP", "Git", "REST API", "FastAPI"],
    "Data & Analytics": [
      "MySQL",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "SciPy",
    ],
    "Vector Databases": ["Pinecone", "ChromaDB"],
    "Other Tools": [
      "LangGraph",
      "LangSmith",
      "HuggingFace",
      "LaTeX",
      "Pydantic",
      "MCP",
    ],
  };

  const ProjectModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <div className="w-full aspect-[3/2] bg-muted rounded-lg mb-6 flex items-center justify-center overflow-hidden">
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

  return (
    <div className="min-h-screen metallic-bg text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="section min-h-screen flex items-center justify-center px-4 sm:px-6 relative pt-6 sm:pt-0 safe-pt">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img
              src={profilePicture}
              alt="Vladyslav Horbatenko"
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-2 border-border mt-4 sm:mt-0"
            />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 metallic-name">
              Vladyslav Horbatenko
            </h1>
            <div className="text-lg md:text-2xl text-muted-foreground mb-2 h-7 md:h-8">
              <Typewriter
                phrases={[
                  "AI Engineer",
                  "Data Science",
                  "Computer Science",
                  "AWS Infrastructure",
                  "LLM Applications",
                  "Business Automation",
                ]}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
              <MapPin className="w-4 h-4" />
              <span>Copenhagen, Denmark</span>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Currently pursuing MSc in Human-Centered AI at DTU. Passionate about
            developing intelligent systems that solve real-world problems
            through machine learning, natural language processing, and cloud
            technologies.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch justify-center gap-3 sm:gap-4 mb-12 max-w-sm sm:max-w-none mx-auto w-full">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <a
                href="https://github.com/rifolio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <a
                href="https://www.linkedin.com/in/vladyslav-horbatenko/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <a href="mailto:vladyslav.horbatenko.work@gmail.com">
                <Mail className="w-5 h-5 mr-2" />
                Contact
              </a>
            </Button>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <a href={cvHref} target="_blank" rel="noopener noreferrer">
                <FileText className="w-5 h-5 mr-2" />
                CV
              </a>
            </Button>
          </div>

          <button
            onClick={() => scrollToSection("projects")}
            className="animate-bounce text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[1fr] items-stretch">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer group flex flex-col card-neon h-full"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-[3/2] w-full bg-muted flex items-center justify-center overflow-hidden">
                  {project.coverImage &&
                  !String(project.coverImage).startsWith("/api/placeholder") ? (
                    <img
                      src={project.coverImage}
                      alt={project.coverImageAlt || project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="px-4 text-center">
                      <span className="text-sm sm:text-base md:text-lg font-medium text-muted-foreground line-clamp-2">
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    {project.github ||
                    project.projectUrl ||
                    project.companyUrl ? (
                      <a
                        href={
                          project.github ||
                          project.projectUrl ||
                          project.companyUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Open project link"
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                      >
                        <span className="inline-flex items-center justify-center w-4 h-4">
                          <ExternalLink className="w-4 h-4" strokeWidth={2} />
                        </span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center w-4 h-4 shrink-0 text-muted-foreground/60">
                        <ExternalLink
                          className="w-4 h-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-3">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        +{project.tech.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                    {project.company &&
                      (project.companyUrl ? (
                        <a
                          href={project.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {project.company}
                        </a>
                      ) : (
                        <span>{project.company}</span>
                      ))}
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Skills & Technologies
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {Object.entries(skills).map(([category, skillList], index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-6 bg-card"
              >
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="section py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Education
          </h2>
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold">
                    MSc in Human-Centered Artificial Intelligence
                  </h3>
                  <p className="text-primary font-medium">
                    Technical University of Denmark (DTU)
                  </p>
                </div>
                <p className="text-sm font-medium mt-2 md:mt-0">
                  Sep 2025 - Jun 2027
                </p>
              </div>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold">
                    BSc in Computer Science and Mathematics
                  </h3>
                  <p className="text-primary font-medium">
                    Roskilde University (RUC)
                  </p>
                </div>
                <p className="text-sm font-medium mt-2 md:mt-0">
                  Sep 2022 - Jun 2025
                </p>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Graduated with focus on AI, machine learning, and mathematical
                modeling
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            I'm always interested in discussing new opportunities,
            collaborations, or just chatting about AI and technology.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <a href="mailto:vladyslav.horbatenko.work@gmail.com">
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <a
                href="https://www.linkedin.com/in/vladyslav-horbatenko/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Vladyslav Horbatenko.</p>
        </div>
      </footer>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default App;
