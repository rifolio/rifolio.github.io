import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { loadPosts } from "@/lib/blog.js";

const motionSafe = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(String(dateStr));
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function PreviewCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col relative bg-card border-2 border-border hover:border-primary transition-colors duration-200 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        clipPath:
          "polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)",
      }}
    >
      {/* Amber pixel accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary group-hover:h-1 transition-all duration-200" />

      {/* Category + tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="font-pixel text-[9px] leading-none px-2 py-1 bg-primary text-background border border-primary uppercase tracking-wide">
          {post.type === "project" ? "Project" : "Writing"}
        </span>
        {Array.isArray(post.tags) &&
          post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="font-pixel text-[9px] leading-none px-2 py-1 bg-primary/10 text-primary border border-primary/30"
            >
              {tag}
            </span>
          ))}
      </div>

      {/* Title */}
      <h3 className="font-display-hero text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug mb-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>
      )}

      {/* Footer: date + read link */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <time className="font-pixel text-[9px] text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <span className="inline-flex items-center gap-1.5 text-primary">
          <span className="font-pixel text-[9px] leading-none group-hover:underline">
            READ
          </span>
          <span className="text-sm leading-none transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function LatestWriting() {
  const posts = loadPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      className="section-wrap py-20 sm:py-28 safe-px border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-12 flex flex-wrap items-end justify-between gap-4"
          {...motionSafe}
        >
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              From the blog
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Latest writing
            </h2>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-1.5 text-primary hover:text-primary/70 transition-colors"
          >
            <span className="font-pixel text-[10px] leading-none tracking-wide uppercase group-hover:underline">
              All posts
            </span>
            <span className="text-sm leading-none transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          {...motionSafe}
          transition={{ ...motionSafe.transition, delay: 0.06 }}
        >
          {posts.map((post) => (
            <PreviewCard key={post.slug} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
