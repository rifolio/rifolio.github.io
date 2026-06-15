import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar.jsx";
import { loadPosts } from "@/lib/blog.js";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/8bit-pagination.tsx";

const PAGE_SIZE = 6;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(String(dateStr));
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block relative bg-card border-2 border-border hover:border-primary transition-colors duration-200 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        /* pixel-corner effect — clip the very corners */
        clipPath:
          "polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)",
      }}
    >
      {/* Amber pixel accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary group-hover:h-1 transition-all duration-200" />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-pixel text-[9px] leading-none px-2 py-1 bg-primary/10 text-primary border border-primary/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 className="font-display-hero text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug mb-2">
        {post.title}
      </h2>

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

export default function Blog() {
  const posts = loadPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const [page, setPage] = useState(1);

  function goToPage(p) {
    const clamped = Math.min(Math.max(1, p), totalPages);
    setPage(clamped);
    // Scroll to top of list
    const el = document.getElementById("blog-list-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pagePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen page-canvas text-foreground overflow-x-hidden relative z-0">
      <div className="relative z-10">
        <Navbar />

        <main className="safe-px pt-16 pb-24">
          <div className="mx-auto max-w-6xl">

            {/* Page header */}
            <div className="mb-12">
              <p className="font-pixel text-[10px] text-primary tracking-widest uppercase mb-3">
                {"// notes & writing"}
              </p>
              <h1 className="font-display-hero text-4xl sm:text-5xl font-bold text-foreground mb-3">
                Blog
              </h1>
              <p className="text-base text-muted-foreground max-w-xl">
                Thoughts on AI engineering, building with LLMs, and whatever else I find worth writing down.
              </p>
            </div>

            {/* Scroll anchor */}
            <div id="blog-list-top" />

            {/* Post grid */}
            {pagePosts.length === 0 ? (
              <p className="font-pixel text-sm text-muted-foreground py-16 text-center">
                No posts yet — check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {pagePosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}

            {/* 8-bit pagination — only show if more than one page */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(page - 1);
                        }}
                        aria-disabled={page === 1}
                        className={page === 1 ? "opacity-40 pointer-events-none" : ""}
                      />
                    </PaginationItem>

                    {/* Page numbers */}
                    {pageNums.map((n) => (
                      <PaginationItem key={n}>
                        <PaginationLink
                          href="#"
                          isActive={n === page}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(n);
                          }}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(page + 1);
                        }}
                        aria-disabled={page === totalPages}
                        className={page === totalPages ? "opacity-40 pointer-events-none" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Single page — show subtle page indicator */}
            {totalPages === 1 && posts.length > 0 && (
              <div className="flex justify-center mt-4">
                <span className="font-pixel text-[9px] text-muted-foreground">
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </span>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
