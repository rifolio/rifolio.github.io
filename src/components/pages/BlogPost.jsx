import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Github, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar.jsx";
import NotFound from "@/components/pages/NotFound.jsx";
import { getPost } from "@/lib/blog.js";
import Mermaid from "@/components/ui/mermaid.jsx";

function formatDate(dateStr) {
  const d = new Date(String(dateStr));
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

const mdComponents = {
  h1: ({ children }) => (
    <h1 className="font-display-hero text-3xl font-bold tracking-tight text-foreground mt-10 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display-hero text-2xl font-bold tracking-tight text-foreground mt-8 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display-hero text-xl font-semibold tracking-tight text-foreground mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="leading-relaxed text-foreground/85 mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 mb-4 space-y-1 text-foreground/85 leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 mb-4 space-y-1 text-foreground/85 leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, className, children }) => {
    if (inline) {
      return (
        <code className="font-pixel text-[0.7em] bg-muted/60 border border-border/60 rounded px-1.5 py-0.5 text-primary">
          {children}
        </code>
      );
    }
    if (/\blanguage-mermaid\b/.test(className || "")) {
      return <Mermaid chart={String(children).trim()} />;
    }
    return (
      <code className="font-mono text-sm text-foreground/90">{children}</code>
    );
  },
  pre: ({ children }) => {
    // Mermaid blocks render their own container; don't wrap them in <pre>.
    const child = Array.isArray(children) ? children[0] : children;
    const lang = child?.props?.className || "";
    if (/\blanguage-mermaid\b/.test(lang)) {
      return <>{children}</>;
    }
    return (
      <pre className="overflow-x-auto rounded-lg border border-border/60 bg-card p-4 mb-4 text-sm leading-relaxed">
        {children}
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 my-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border/40 my-8" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-20 safe-px">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            to="/blog"
            className="group text-primary hover:text-primary/70 transition-colors inline-flex items-center gap-1.5 mb-10"
          >
            <span className="text-sm leading-none transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>
            <span className="font-pixel text-[0.65rem] leading-none tracking-wide">
              all posts
            </span>
          </Link>

          {/* Article header */}
          <header className="mb-10">
            <h1 className="font-display-hero text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <time
                dateTime={String(post.date)}
                className="text-sm text-muted-foreground"
              >
                {post.company ? `${post.company} · ` : ""}
                {post.year || formatDate(post.date)}
              </time>
              {post.grade && (
                <span className="text-sm font-medium text-primary">
                  {post.grade}
                </span>
              )}
              <div className="flex flex-wrap gap-2">
                {/* Category badge — solid, distinct from content tags */}
                <span className="font-pixel text-[0.55rem] px-2 py-1 rounded border border-primary bg-primary text-background tracking-wide uppercase">
                  {post.type === "project" ? "Project" : "Writing"}
                </span>
                {Array.isArray(post.tags) &&
                  post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-pixel text-[0.55rem] px-2 py-1 rounded border border-primary/30 text-primary/80 bg-primary/5 tracking-wide uppercase"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            {/* External link — GitHub if present, else company site */}
            {(post.github || post.link) && (
              <div className="mt-5">
                <a
                  href={post.github || post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-primary/60 hover:border-primary text-primary px-4 py-2 text-sm font-medium transition-colors"
                >
                  {post.github ? (
                    <>
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Visit site
                    </>
                  )}
                </a>
              </div>
            )}

            {/* Cover image — only visible on the post page */}
            {post.cover && (
              <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card">
                <img
                  src={post.cover}
                  alt={post.coverAlt || post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="mt-8 border-t border-border/40" />
          </header>

          {/* Markdown body */}
          <article className="text-foreground/85">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={mdComponents}
            >
              {post.body}
            </ReactMarkdown>
          </article>

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-border/40">
            <Link
              to="/blog"
              className="group text-primary hover:text-primary/70 transition-colors inline-flex items-center gap-1.5"
            >
              <span className="text-sm leading-none transition-transform duration-200 group-hover:-translate-x-0.5">
                ←
              </span>
              <span className="font-pixel text-[0.65rem] leading-none tracking-wide">
                all posts
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
