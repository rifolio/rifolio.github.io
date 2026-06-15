---
title: Diagrams as Code — Sequence, Flow, and Pie with Mermaid
date: 2026-06-10
tags: [meta, webdev, diagrams]
slug: diagrams-with-mermaid
excerpt: This blog now renders Mermaid diagrams straight from markdown. Here are three you'll reach for most — a sequence diagram, a flowchart, and a pie chart.
---

## Why Diagrams as Code

Screenshots of diagrams rot. The source lives in some other tool, the export drifts out of date, and six months later nobody can edit the thing. Writing diagrams as code keeps them in the post, in version control, and diffable like everything else.

This site now renders [Mermaid](https://mermaid.js.org/) directly from fenced code blocks. Drop a ` ```mermaid ` block into any post and it renders inline, themed to match the rest of the site. Here are the three diagram types I reach for most.

## Sequence Diagram

Sequence diagrams are unbeatable for showing how parts of a system talk to each other over time — request flows, auth handshakes, retries.

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web App
    participant A as API
    participant D as Database

    U->>W: Click "Sign in"
    W->>A: POST /auth/login
    A->>D: SELECT user WHERE email
    D-->>A: user row
    A-->>W: 200 + session token
    W-->>U: Redirect to dashboard

    Note over W,A: Token cached for 15 min
```

The arrows carry meaning: `->>` is a call, `-->>` is a response. That tiny distinction makes the diagram readable at a glance.

## Flowchart

When the story is about decisions and branches rather than time, a flowchart is the right tool. Here's a request hitting a cache:

```mermaid
flowchart TD
    A[Incoming request] --> B{In cache?}
    B -->|Yes| C[Return cached value]
    B -->|No| D[Query database]
    D --> E{Query OK?}
    E -->|Yes| F[Write to cache]
    F --> G[Return value]
    E -->|No| H[Return 503]
    C --> I([Done])
    G --> I
    H --> I
```

`TD` means top-down; swap it for `LR` to lay the same graph out left-to-right when it gets wide.

## Pie Chart

For a quick proportional breakdown — where time or traffic actually goes — a pie chart says it in one glance.

```mermaid
pie showData title Where the request budget goes
    "Retrieval" : 45
    "Generation" : 30
    "Serialization" : 15
    "Everything else" : 10
```

## How It Works

Each fenced ` ```mermaid ` block is intercepted in the markdown renderer and handed to a small `<Mermaid>` component, which calls `mermaid.render()` and drops the resulting SVG into the page. The theme variables are wired to the same orange-on-near-black palette as the rest of the site, so diagrams never look bolted on.

That's the whole point of diagrams as code: write once, in plain text, and let the page worry about how they look.
