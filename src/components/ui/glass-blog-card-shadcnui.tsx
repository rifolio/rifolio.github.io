import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";

interface GlassBlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  author?: {
    name: string;
    avatar: string;
  };
  date?: string;
  readTime?: string;
  tags?: string[];
  ctaLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function GlassBlogCard({
  title,
  excerpt,
  image,
  author,
  date,
  readTime,
  tags = [],
  ctaLabel = "Read Article",
  onClick,
  className,
}: GlassBlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-[400px]", className)}
    >
      <Card
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        onClick={onClick}
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border-border/50 bg-card/30 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
          onClick && "cursor-pointer"
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          {image ? (
            <motion.img
              src={image}
              alt={title ?? ""}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-muted/50 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground line-clamp-2 px-4 text-center">
                {title}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
            {tags?.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-background/50 backdrop-blur-sm hover:bg-background/80 shrink-0"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25"
            >
              <BookOpen className="h-4 w-4" />
              {ctaLabel}
            </motion.span>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {excerpt}
            </p>
          </div>

          {(author || date || readTime) && (
            <div className="flex items-center justify-between border-t border-border/50 pt-3">
              {author && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback>{author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium text-foreground">
                      {author.name}
                    </span>
                    {date && (
                      <span className="text-muted-foreground">{date}</span>
                    )}
                  </div>
                </div>
              )}
              {readTime && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
