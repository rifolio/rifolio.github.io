import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User2,
  LoaderCircle,
  Minus,
} from "lucide-react";

import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";

const API_URL = import.meta.env.VITE_CHAT_API_URL;

function generateMockReply(prompt) {
  const p = (prompt || "").toLowerCase();
  const baseUrl = import.meta.env.BASE_URL || "/";
  const cvUrl = `${baseUrl}CV.pdf`;
  const github = "https://github.com/rifolio";
  const linkedin = "https://www.linkedin.com/in/vladyslav-horbatenko/";
  const liveSite = "https://rifolio.me";

  // Quick intents
  if (/(who|about|your name|introduce)/.test(p)) {
    return "I'm Vladyslav Horbatenko's assistant. Vladyslav is an AI Engineer based in Copenhagen, focusing on LLM applications, data science, and cloud infrastructure.";
  }
  if (/where|based|location/.test(p)) {
    return "Vladyslav is based in Copenhagen, Denmark.";
  }
  if (/skill|stack|technolog/.test(p)) {
    return "Key skills: Python, Java, C#, JavaScript; AI/ML: LLaMA, OpenAI, PyTorch, TensorFlow, Scikit-learn, DSPy, LangChain; Cloud/DevOps: AWS, GCP, REST, FastAPI; Data: MySQL, Pandas, NumPy; Tools: LangGraph, LangSmith, HuggingFace.";
  }
  if (/project|experience|work/.test(p)) {
    return "Highlights: 1) AI Customer Support Chatbot at Tryp.com (LLM-powered, handles ~5,500 monthly inquiries). 2) AI Assistant for Refugees at Bevar Ukraine (AWS Bedrock, RAG, 24/7 support). 3) Table extraction for pharmaceutical PDFs at Novo Nordisk (DETR/Table Transformer).";
  }
  if (/educat|study|degree|msc|bsc/.test(p)) {
    return "Education: MSc Human-Centered AI at DTU (2025–2027), BSc in Computer Science & Mathematics at Roskilde University (2022–2025).";
  }
  if (/contact|email|reach/.test(p)) {
    return "You can reach Vladyslav at vladyslav.horbatenko.work@gmail.com.";
  }
  if (/github/.test(p)) {
    return `GitHub: ${github}`;
  }
  if (/linkedin|linked in/.test(p)) {
    return `LinkedIn: ${linkedin}`;
  }
  if (/cv|resume/.test(p)) {
    return `You can view the CV here: ${cvUrl}`;
  }
  if (
    /website|site|live|current version|deployed|production|where can i see/.test(
      p
    )
  ) {
    return `The current live site is available at ${liveSite}`;
  }

  return "I can answer questions about Vladyslav's background, projects, skills, education, and contact details. Try asking: 'What are your key projects?', 'What skills do you use?', 'Where are you based?', or 'How can I contact you?'";
}

async function sendToAssistantApi({ messages }) {
  // Expecting API to return { reply: string } or { message: string } or { answer: string }
  if (!API_URL) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return { reply: generateMockReply(lastUser?.content || "") };
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Assistant API error (${response.status}): ${text}`);
  }

  // Try JSON; fall back to text
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    const reply = data?.reply || data?.message || data?.answer || "";
    if (typeof reply !== "string" || reply.trim().length === 0) {
      throw new Error("Assistant API returned an empty reply.");
    }
    return { reply };
  } else {
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error("Assistant API returned an empty response.");
    }
    return { reply: text };
  }
}

export default function AssistantChat({ defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    // Simple in-memory start; can be hydrated from localStorage later if desired
    return [
      {
        id: `m-${Date.now()}`,
        role: "assistant",
        content:
          "Hi! I'm Vladyslav's virtual assistant. Ask me about his projects, skills, education, or how to contact him.",
        ts: Date.now(),
      },
    ];
  });

  const viewportRef = useRef(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  );

  useEffect(() => {
    if (viewportRef.current) {
      // Scroll to bottom on new messages
      const el = viewportRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isOpen]);

  function toggleOpen() {
    setIsOpen((v) => !v);
    setIsMinimized(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage = {
      id: `m-${Date.now()}-u`,
      role: "user",
      content: text,
      ts: Date.now(),
    };

    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setIsSending(true);

    try {
      const { reply } = await sendToAssistantApi({ messages: next });
      const assistantMessage = {
        id: `m-${Date.now()}-a`,
        role: "assistant",
        content: reply,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage = {
        id: `m-${Date.now()}-e`,
        role: "assistant",
        content:
          "Sorry, I couldn't get an answer right now. Please try again later or check the chat API configuration.",
        ts: Date.now(),
        error: true,
      };
      // eslint-disable-next-line no-console
      console.error(error);
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          size="lg"
          className="rounded-full shadow-lg h-12 w-12 p-0"
          aria-label="Open assistant chat"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[92vw] max-w-[380px] h-[70vh] max-h-[560px] p-0 shadow-2xl border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback>
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Ask about Vladyslav</CardTitle>
                <div className="text-xs text-muted-foreground">
                  {API_URL ? "Live answers enabled" : "Waiting for API URL"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized((v) => !v)}
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleOpen}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="px-0 py-0 h-full grid grid-rows-[1fr_auto]">
                <div className="px-4 pt-4">
                  <ScrollArea className="h-[360px]">
                    <div
                      ref={viewportRef}
                      className="pr-3 overflow-y-auto max-h-[360px]"
                    >
                      <ol className="space-y-4">
                        {messages.map((m) => (
                          <li key={m.id} className="flex items-start gap-2">
                            <div className="mt-0.5">
                              {m.role === "assistant" ? (
                                <Avatar className="size-7">
                                  <AvatarFallback>
                                    <Bot className="w-3.5 h-3.5" />
                                  </AvatarFallback>
                                </Avatar>
                              ) : (
                                <Avatar className="size-7">
                                  <AvatarFallback>
                                    <User2 className="w-3.5 h-3.5" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                            <div
                              className={
                                m.role === "assistant"
                                  ? "bg-muted/60 text-sm rounded-md px-3 py-2 whitespace-pre-wrap"
                                  : "bg-primary/10 text-sm rounded-md px-3 py-2 whitespace-pre-wrap"
                              }
                            >
                              {m.content}
                            </div>
                          </li>
                        ))}
                        {isSending && (
                          <li className="flex items-center gap-2 text-muted-foreground text-sm">
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Thinking...
                          </li>
                        )}
                      </ol>
                    </div>
                  </ScrollArea>
                </div>

                <div className="border-t p-3">
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about projects, skills, education..."
                      className="min-h-10 max-h-32"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!canSend}
                      className="h-10 px-3"
                    >
                      {isSending ? (
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    Press Enter to send, Shift+Enter for newline
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
