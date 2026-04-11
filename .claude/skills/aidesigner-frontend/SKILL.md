---
name: aidesigner-frontend
description: Use when the user asks to generate, refine, or iterate on HTML/CSS UI designs, mockups, landing pages, or web components from a text description. Also use for checking AIDesigner account credits or identity.
---

# AIDesigner Frontend

This skill wraps the AIDesigner MCP server (registered in `.mcp.json` at the repo root), which generates and refines HTML/CSS UI designs from natural-language prompts.

## When to use

Trigger this skill when the user asks for:

- A new UI design, mockup, landing page, or component from a text description.
- Iteration on an existing AIDesigner output (e.g. "make it darker", "add a hero section").
- AIDesigner account status: credit balance, identity, or OAuth scopes.

Do not use this skill for hand-editing existing components in `src/` — only for generating or refining AIDesigner output.

## Available MCP tools

The `aidesigner` MCP server exposes four tools:

- `generate_design` — create a new HTML/CSS design from a prompt.
- `refine_design` — iterate on a previously generated design with feedback. Prefer this over regenerating from scratch.
- `get_credit_status` — check account balance and usage.
- `whoami` — return account identity and OAuth scopes.

## Setup

1. `.mcp.json` at the repo root registers the `aidesigner` HTTP MCP server at `https://api.aidesigner.ai/api/v1/mcp`.
2. On first use, the MCP client runs an OAuth flow. The user needs an AIDesigner account; token storage and refresh are handled by the client.
3. If the server isn't connected, stop and tell the user to connect `aidesigner` in their MCP client and complete OAuth — do not work around it.

## Limits

- 30 requests per 60 seconds per account.
- At most 4 concurrent remote generations.

## Notes

- AIDesigner is a third-party service. Do not include secrets, private user data, or proprietary code in design prompts.
- Generated output is HTML/CSS. Porting it into the Next.js app in `src/` is a separate step done through normal code edits.

## Reference

Official docs: https://www.aidesigner.ai/docs/mcp
