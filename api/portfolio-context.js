/**
 * Portfolio context for RAG injection via additional_instructions.
 * Plain-text summary of content.ts data (can't import content.ts directly due to SVG/React imports).
 * Keep under ~2000 tokens.
 */

export function buildPortfolioContext() {
  return `
Use the following portfolio data to answer questions accurately about Jadamal Mahendra:

## SKILLS
- React.js (5/5): Expert in building interactive UIs and SPAs, state management with Redux
- Node.js (4/5): Server-side development, scalable backend systems
- GraphQL (4/5): Designing and implementing GraphQL APIs with Prisma
- Material UI (4/5): Responsive UI components
- TypeScript (4/5): Type safety in complex projects
- Next.js (4/5): Server-rendered React apps and static websites
- Web3 / Blockchain (3/5): dApps, NFT marketplaces using Solidity, Web3.js, Hardhat
- Databases (4/5): PostgreSQL, MongoDB, TimescaleDB
- Microfrontends (4/5): Modular and scalable UI development
- Git (4/5): Version control, branching, merging
- Prisma (4/5): Type-safe database access
- PostgreSQL / TimescaleDB (4/5): 169-table IIoT schema, energy monitoring
- Docker (3/5): Containerized environments
- Tailwind CSS (4/5): Utility-first CSS
- AI Orchestration & Agentic Workflows (4/5): Dual-AI agent pipelines (Claude + Kimi), tmux-based orchestration

## EXPERIENCE
1. Elliot Systems — Technical Lead (May 2024 – Present, Pune, India)
   Tech: React.js, Next.js, TypeScript, Prisma, PostgreSQL, TimescaleDB, Docker, Tailwind CSS, Redux, Microfrontends, n8n, Jest, Git
   - Leading RecruAI — enterprise HRMS with AI-powered recruitment
   - Designed 169-table IIoT database schema (TimescaleDB) for energy monitoring
   - Built multi-role RBAC system (7 roles) with strict TypeScript
   - Pioneered dual-AI agent orchestration (Claude + Kimi) with tmux pipeline
   - Google Calendar OAuth for HR interview scheduling
   - MongoDB to TimescaleDB production migration with multi-agent ETL
   - Automated interview assessment with Google Apps Script + ChatGPT

2. ViralNation (Contract) — Lead Frontend Developer (Apr 2023 – May 2024, Remote/Pune)
   Tech: React, React Native, Next.js, Node.js, GraphQL, Solidity, Web3.js, Prisma, MUI, TypeScript, OpenAI API
   - Led distributed team for influencer marketing platform
   - Built unified messaging (email, in-app, WhatsApp) and real-time chat (GraphQL Subscriptions)
   - Cross-platform analytics dashboard (Instagram, YouTube, TikTok)
   - NFT marketplace with Solidity and Web3.js
   - React Native with Imagly for media-rich mobile experiences
   - OpenAI API integration for AI-driven content generation

3. Oodles Technologies — Lead Software Developer (May 2021 – Mar 2023, Remote/Gurugram)
   Tech: React, React Native, TypeScript, Redux, Redux-Saga, WebSockets
   - Led 10+ end-to-end web & mobile projects
   - Improved API response times by 30%+, app load time <1s
   - Real-time features with WebSockets
   - Mentored junior developers, boosting team efficiency by 40%

## SERVICES OFFERED
1. Frontend Development (React, Next.js, TypeScript, Microfrontends, Redux, MUI, Fluent UI)
2. Backend & API Development (Node.js, Express, GraphQL, Prisma, SQL, NoSQL)
3. Mobile App Development (React Native, cross-platform iOS/Android)
4. Web3 & Blockchain Solutions (dApps, Solidity smart contracts, NFT marketplaces)
5. Database & IoT Engineering (TimescaleDB, multi-tenant architecture, MQTT, OPC-UA)
6. AI Workflow & Automation (AI pipelines, agent orchestration, n8n, Claude Code, Kimi)

## KEY PROJECTS
- RecruAI: AI-Powered HRMS (Next.js, TypeScript, Prisma, PostgreSQL, NextAuth, Tailwind, Playwright)
- Elliot-IIOT: Industrial IoT Platform (TimescaleDB, PostgreSQL, Node.js, Docker, TurboRepo)
- AI Agent Orchestrator: Dual-AI dev pipeline with PM, Worker, QA, UX Tester agents (Bash, tmux, Claude, Kimi)
- Influencer Marketing Platform: Real-time chat, analytics, NFT marketplace (React, Next.js, GraphQL, Solidity)
- Transportation Management System UI (React, TypeScript, Redux, Microfrontends)

## CONTACT
- Email: jadamalmahendra@gmail.com
- Phone: 07303037961
- LinkedIn: linkedin.com/in/jadamalmahendra
- Website: https://jadamalmahendra.inowix.io/

## AWARDS
- Rising Star Award — Oodles Technologies (May 2022): Rapid progression from associate to lead developer within a year

## SUMMARY
Senior Software Engineer with 4+ years of experience specializing in scalable web apps, IIoT platforms, and enterprise HRMS. Career started May 2021. Has worked on 20+ projects.
`.trim();
}
