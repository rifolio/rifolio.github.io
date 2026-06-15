---
title: How MCP Works, Explained with an Airline Booking Example
date: 2026-06-08
type: writing
tags: [mcp, ai, llm]
slug: how-mcp-works-airlines
excerpt: A plain-English walkthrough of the Model Context Protocol using an airline booking assistant, with a sequence diagram of the full request flow.
---

## What is MCP?

The **Model Context Protocol (MCP)** is an open standard that lets AI applications talk to external tools and data in a consistent way. Think of it like USB-C for LLMs: instead of writing a custom integration for every tool, you build one MCP server and any MCP-aware app can use it.

There are three roles to keep in mind:

- **Host** — the AI app the user interacts with (a chat client, an IDE, an assistant).
- **Client** — the connector inside the host that speaks MCP. One client per server connection.
- **Server** — the program that exposes capabilities: **tools** (actions), **resources** (readable data), and **prompts** (reusable templates).

The model never calls a server directly. The host orchestrates everything, and the model only decides *which* tool to call and *with what arguments*.

## The airline example

Imagine an airline ships an **Airline MCP server** that exposes three tools:

- `search_flights(origin, destination, date)` — find available flights
- `get_fare(flight_id)` — get the current price
- `book_flight(flight_id, passenger)` — reserve a seat

A traveler opens their AI assistant and types:

> "Find me a flight from Copenhagen to Lisbon next Friday and book the cheapest one."

Here's what happens under the hood.

## The full flow

```mermaid
sequenceDiagram
    participant U as User
    participant H as Host (AI Assistant)
    participant M as LLM (Model)
    participant C as MCP Client
    participant S as Airline MCP Server
    participant API as Airline Backend

    Note over H,S: Connection setup (once)
    H->>C: start client
    C->>S: initialize
    S-->>C: capabilities
    C->>S: tools/list
    S-->>C: search_flights, get_fare, book_flight

    Note over U,API: A user request
    U->>H: "Book the cheapest CPH→LIS flight next Friday"
    H->>M: prompt + available tools
    M-->>H: call search_flights(CPH, LIS, 2026-06-19)
    H->>C: invoke tool
    C->>S: tools/call search_flights
    S->>API: query flights
    API-->>S: 3 flights
    S-->>C: flight results
    C-->>H: results
    H->>M: tool result

    M-->>H: call get_fare(flight_123)
    H->>C: invoke tool
    C->>S: tools/call get_fare
    S->>API: fetch price
    API-->>S: €89
    S-->>C: fare
    C-->>H: fare
    H->>M: tool result

    M-->>H: call book_flight(flight_123, passenger)
    H->>U: confirm booking?
    U->>H: yes
    H->>C: invoke tool
    C->>S: tools/call book_flight
    S->>API: create reservation
    API-->>S: booking confirmed
    S-->>C: confirmation #ABC123
    C-->>H: confirmation
    H->>M: tool result
    M-->>H: "Booked! Confirmation ABC123."
    H->>U: "Booked! Confirmation ABC123."
```

## Walking through it

**1. Setup (happens once).** When the host starts, the client connects to the server and runs an `initialize` handshake. The server reports what it can do, and the client asks for the tool list. Now the host knows three tools exist and what arguments they take.

**2. The model decides.** The user's message and the tool definitions go to the model. The model doesn't run anything — it just responds "I want to call `search_flights` with these arguments." The host carries out that intent through the client.

**3. Tool calls loop.** Each result goes back to the model, which decides the next step: search, then check the fare, then book. This loop continues until the model has enough to answer.

**4. Humans stay in control.** Notice the `book_flight` step pauses for confirmation. Reads (searching, pricing) can run freely, but an action that spends money or changes state should ask the user first. MCP makes this easy because the host sees every tool call before it executes.

## Why this matters

The airline wrote **one** server. It works in any MCP host — a desktop assistant, a customer-support bot, a travel-planning agent — without the airline knowing or caring which one. And the AI app added flight booking without writing airline-specific code; it just connected to another MCP server.

That decoupling — tools on one side, models on the other, a shared protocol in between — is the whole point of MCP.
