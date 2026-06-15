---
title: Building with LLMs — Lessons From Production RAG
date: 2026-05-20
tags: [ai, rag, llms]
slug: building-with-ai
excerpt: Six months running a retrieval-augmented generation pipeline in production taught me things no blog post prepared me for.
---

## The Gap Between Demo and Production

Every RAG demo looks the same: embed some docs, retrieve top-k chunks, stuff them into a prompt, get a pretty answer. It works in a notebook. It falls apart in production.

After six months running a customer-facing RAG pipeline at scale, I've collected a list of lessons that I wish someone had written down before I started. This is that post.

## The Retrieval Problem Is Harder Than It Looks

Most teams spend 80% of their time on generation and 20% on retrieval. It should be the other way around. Bad retrieval means the model is hallucinating from missing context; good retrieval makes even a smaller model shine.

Things that actually moved the needle for us:

- **Hybrid search** (BM25 + dense vectors) outperformed pure semantic search on short, keyword-heavy queries
- **Chunk overlap** of 10–15% reduced boundary artifacts more than increasing chunk size
- **Re-ranking** with a cross-encoder as a second pass cut irrelevant context by ~40%
- Metadata filters (date range, document type) kept latency predictable under load

## Evaluating Without Ground Truth

You rarely have labelled QA pairs in the wild. We built a lightweight eval loop that uses the model to judge its own outputs — with careful prompting to avoid self-serving bias:

```python
EVAL_PROMPT = """
You are a strict evaluator. Given a question, a retrieved context, and an answer,
rate the answer on three axes (1-5):
- Faithfulness: is the answer grounded in the context?
- Relevance: does the answer address the question?
- Completeness: are important details missing?

Return JSON: {{"faithfulness": N, "relevance": N, "completeness": N, "notes": "..."}}

Question: {question}
Context: {context}
Answer: {answer}
"""

def eval_response(question, context, answer, client):
    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=256,
        messages=[{"role": "user", "content": EVAL_PROMPT.format(
            question=question, context=context, answer=answer
        )}],
    )
    return json.loads(resp.content[0].text)
```

Not perfect, but it caught regressions fast and gave us a metric to track across deploys.

## What I'd Do Differently

If I were starting this pipeline today:

1. Define eval criteria before writing a single line of retrieval code
2. Use a vector DB that supports metadata filtering from day one — retrofitting it is painful
3. Log every retrieval + generation pair from the start; you'll want that data for fine-tuning later
4. Treat the prompt as code: version it, review it, test it

## The Honest Bottom Line

LLMs are genuinely useful infrastructure now, not just demos. But "it works in the notebook" is nowhere near "it works for users at 2 AM on a Tuesday." The gap is mostly boring engineering: observability, caching, graceful degradation, and ruthless eval discipline.

That's the unsexy part nobody writes about. So I wrote about it.
