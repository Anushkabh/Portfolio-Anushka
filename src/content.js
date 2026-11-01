/*
 * All site copy lives here. Sources of truth: the portfolio brief and the resume (Nov 2026).
 * Rules worth remembering when editing: facts from those sources only, plain
 * language, no client/patient/colleague names, no em dashes in bullets.
 * Wrap a phrase in **double asterisks** to bold it on the page.
 */

export const profile = {
  name: "Anushka Bhandari",
  headline:
    "Backend engineer who builds systems that stay correct when the data source is messy, and owns them from the client conversation to production.",
  bio:
    "I'm a backend engineer with about two years at startups. I work across the whole path: I run requirement meetings with clients, write the design doc, build the system and ship it to production. At Copper Digital that has meant a nightly data sync covering 925 patients across 8 clients, a billing-readiness system and end-to-end form automation, all in use by clients. Before that I was a core engineer in a 4-person team at NativeBridge, a remote Android testing platform that reached $80k ARR.",
  current: "Software Engineer at Copper Digital",
  location: "Lucknow, India",
  availability: "Open to roles anywhere in India",
  email: "anushka.bhandari316@gmail.com",
  resume: "/resume.pdf",
  links: {
    linkedin: "https://www.linkedin.com/in/anushka-bhandari-163278224",
    github: "https://github.com/Anushkabh",
    leetcode: "https://leetcode.com/u/AnushkaBhandari/",
  },
};

export const stats = [
  { value: "~2 years", label: "of backend engineering at startups" },
  { value: "925", label: "patients synced nightly across 8 clients, in about 2 hours" },
  { value: "100+", label: "concurrent device sessions through a TCP proxy I built" },
  { value: "$80k ARR", label: "annual recurring revenue at NativeBridge, where I was one of 4 engineers" },
];

export const strengths = [
  {
    icon: "product",
    title: "Product understanding",
    summary:
      "I start from the client's problem. I run the requirement meetings, turn what I hear into a design doc, then build it and see it through to daily use.",
    points: [
      "Billing rules, discharge form autofill and workflow automation each went from client meeting to design doc to production, and **all are in active use by clients**.",
      "The billing-readiness system **replaced a manual chart-by-chart audit** at a 700-patient client.",
      "Shaped the platform design around **5 sellable modules** with role-based access.",
    ],
  },
  {
    icon: "build",
    title: "Building from scratch",
    summary:
      "Both my roles have been at startups, where I built core systems that paying clients and thousands of users rely on.",
    points: [
      "One of **4 engineers** who took NativeBridge to **$80k ARR**, 2,000+ weekly active users in 110+ countries, and Product Hunt Product of the Day.",
      "Built NativeBridge's **network layer, device allocation, subscription billing** and device-management app.",
      "At Copper, built the **billing-readiness system** (live since Oct 2026) and AI document intelligence on AWS Bedrock.",
    ],
  },
  {
    icon: "scale",
    title: "Systems and scale",
    summary:
      "I design systems that stay correct under real load and messy data, and write the design docs teams build from.",
    points: [
      "Nightly sync for **about 925 patients across 8 clients in about 2 hours**, with no failed jobs.",
      "Platform design that cut **13 services to 7**; p99 session start time cut **40%**, and stable through a launch traffic spike.",
      "**Terabytes migrated with zero downtime**; about **300 failed updates a day** ended with per-patient locks.",
    ],
  },
];

export const experience = [
  {
    company: "Copper Digital",
    role: "Software Engineer",
    location: "Remote",
    period: "Mar 2026 to present",
    current: true,
    context:
      "Copper Digital builds AI agents and automation for US home-health care providers. These providers keep patient records in an electronic medical record system (EMR), WellSky Kinnser, which has no API, so Copper reads and writes it through browser automation.",
    highlights: [
      {
        title: "Nightly data sync",
        text: "Designed the nightly sync that keeps patient records current from clients' EMR, on AWS (Lambda, SQS, Playwright workers on ECS). Reading only what changed cut each patient from **about 4 minutes to about 1 minute**: **about 925 patients across 8 clients in about 2 hours**, with **no failed jobs**.",
      },
      {
        title: "Billing-readiness system",
        text: "Built a system that checks each Medicare claim before it is sent (signed visits, doctor's orders, consents), uses AI to read documents, and routes each gap to the person who must fix it. It **replaced a manual chart-by-chart audit** at a 700-patient client. **Live since 29 Oct 2026.**",
      },
      {
        title: "Patient assessment forms, end to end",
        text: "Built end-to-end automation for OASIS-E2, the Medicare-required patient assessment. AI drafts discharge and transfer forms from visit notes, then the system writes them into the EMR and verifies the save. **Transfers now run with no manual step.**",
      },
      {
        title: "AI document intelligence",
        text: "Built a system on AWS Bedrock that turns referral and hospital papers into facts, each linked to its source page. Patients with a recorded hospital history rose from **95 to 268**, for **about $35 across 3,315 documents**.",
      },
      {
        title: "Platform design",
        text: "Wrote the platform design doc that merged separate products into **one backend with 5 sellable modules** and role-based access, cutting **13 services to 7**; teammates built the individual modules. Also wrote design docs on FHIR integration (FHIR is the standard format for exchanging health records) and on build vs buy for browser automation.",
      },
      {
        title: "Requirements to production",
        text: "Ran requirement meetings with clients and the founder, turned them into design docs (billing rules, discharge form autofill, workflow automation), then **built and shipped each one to production**, where **all are in active use by clients**.",
      },
      {
        title: "Duplicate patient records",
        text: "Stopped duplicates arriving from 4 sources (fax, referral portals, the EMR and uploads) with one shared matching system; **merged 31 existing duplicates** safely and ended a loop that re-processed **about 4,800 notes a month**.",
      },
      {
        title: "Reliability",
        text: "Fixed a database locking issue causing **about 300 failed updates a day** by giving each patient its own lock and ordering writes, and made every data fix go through a **dry run and a replay on real data** before release.",
      },
    ],
  },
  {
    company: "NativeBridge",
    role: "Software Engineer",
    note: "Joined as a Software Engineering Intern (Jan to Jul 2025)",
    location: "Bangalore",
    period: "Jan 2025 to Feb 2026",
    current: false,
    context:
      "NativeBridge is a cloud platform where app developers test on real Android phones remotely. I was a core engineer in a team of 4. The product reached $80k in annual recurring revenue (ARR), 2,000+ weekly active users in 110+ countries, and was Product Hunt Product of the Day.",
    highlights: [
      {
        title: "Network layer",
        text: "Built the network layer that lets developers control remote phones: a Python TCP proxy routing Android debug (ADB) traffic, with Redis-backed session state and per-session access control, serving **100+ concurrent device sessions**.",
      },
      {
        title: "Device allocation",
        text: "Built the device-allocation backend with FastAPI and SQS, queuing session requests and keeping a pool of warm devices ready; cut p99 session start time (the slowest 1% of starts) by **40%** and **stayed stable through the Product Hunt launch traffic spike**.",
      },
      {
        title: "Subscription billing",
        text: "Built subscription billing on Paddle (3 plans, prorated credits, retries for failed payments, duplicate-safe payment webhooks), keeping **every account's billing state correct** through plan changes and payment failures.",
      },
      {
        title: "Device management app",
        text: "Built an Android Enterprise device-management app (DPC) using DevicePolicyManager and Firebase Cloud Messaging, giving the platform **central control of every phone**: remote commands and persistent admin access.",
      },
      {
        title: "Access control and integrations",
        text: "Built access control for app assets and integrated **Slack, Jira and GitHub** via OAuth 2.0.",
      },
      {
        title: "Log pipeline",
        text: "Built a log pipeline streaming device and session logs to Betterstack for live debugging and AWS Glacier for long-term archival, with structured parsing and tracing that cut **incident resolution time by 60%**.",
      },
      {
        title: "Storage migration",
        text: "Migrated **terabytes of production data** from Google Cloud Storage to AWS S3 with **zero downtime**, moving data, access policies and live service traffic without interrupting users.",
      },
    ],
  },
];

export const projects = [
  {
    name: "Shiplog",
    kind: "AI release notes platform",
    period: "Aug to Sep 2026",
    description: "Turns merged GitHub pull requests into customer-facing release notes.",
    highlights: [
      "Split the AI step into classify and draft stages so internal changes are filtered by code; feature coverage rose from **89% to 100%** on an 18-pull-request test set.",
      "GitHub webhook ingestion that **never duplicates data** when GitHub resends events (signature checks, delivery-ID dedup, upserts); cut onboarding database calls by **76%** by batching writes.",
      "**No-signup sandbox demo** with streamed AI drafts and an embeddable changelog widget.",
    ],
    links: [
      { label: "Live demo", href: "https://infra-liart-zeta.vercel.app/" },
      { label: "Source", href: "https://github.com/Anushkabh/ShipLog" },
    ],
  },
  {
    name: "BridgeLink",
    kind: "Remote device access command-line tool",
    period: "Oct to Nov 2025",
    description:
      "Python command-line tool for secure remote Android device access over TCP tunnels, with API-key authentication, heartbeat health checks and auto-reconnect.",
    highlights: [],
    links: [{ label: "Source", href: "https://github.com/AutoFlowLabs/bridgelink" }],
  },
  {
    name: "iGOT Karmayogi CMS",
    kind: "Government content platform",
    period: "Jun to Aug 2024",
    description:
      "Content management system (CMS) for a platform of MeitY, India's Ministry of Electronics and IT, so teams update content across portals without deployments. Role-based access and 22-language support, on Node.js, Express, React and MongoDB.",
    highlights: [],
    links: [
      { label: "Live", href: "https://cms-i-got-karmyogi.vercel.app/login" },
      { label: "Source", href: "https://github.com/Anushkabh/CMS-iGOT-Karmayogi" },
    ],
  },
  {
    name: "DaanGo",
    kind: "Crowdfunding platform",
    period: "May to Jun 2024",
    description:
      "Full-stack fundraising platform with Stripe payments, JWT sign-in and email verification with one-time codes (OTP).",
    highlights: [],
    links: [
      { label: "Live", href: "https://daan-go-frontend.vercel.app/" },
      { label: "Source", href: "https://github.com/Anushkabh/DaanG0-Frontend" },
    ],
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "SQL", "C++"] },
  {
    group: "Backend",
    items: ["FastAPI", "SQLAlchemy", "Node.js", "REST APIs", "Event-driven systems", "Message queues", "Playwright"],
  },
  { group: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "MySQL"] },
  {
    group: "AI Engineering",
    items: ["AI agents and tool use", "Eval harnesses", "Prompt caching", "Guardrails", "Human-in-the-loop", "AWS Bedrock", "Claude Code"],
  },
  {
    group: "Cloud and DevOps",
    items: [
      "AWS (ECS Fargate, Lambda, SQS, EventBridge, S3, RDS, Textract)",
      "Docker",
      "Linux",
      "GitHub Actions",
      "CI/CD",
    ],
  },
  { group: "System Design", items: ["High-Level Design (HLD)", "Low-Level Design (LLD)"] },
  {
    group: "Core CS",
    items: ["Data Structures and Algorithms", "Operating Systems", "Database Management Systems", "Computer Networks"],
  },
  { group: "Frontend", items: ["React", "TypeScript"] },
];

export const education = {
  degree: "B.Tech",
  school: "National Institute of Technology Jamshedpur",
  period: "2021 to 2025",
  cgpa: "8.24",
};

export const achievements = [
  {
    icon: "trophy",
    title: "Product Hunt Product of the Day",
    detail:
      "Core engineer in the 4-person team that took NativeBridge to $80k ARR and 2,000+ weekly active users across 110+ countries.",
  },
  {
    icon: "math",
    title: "Indian National Mathematics Olympiad",
    detail: "Qualified for INMO (training camp, IIT Madras).",
  },
  {
    icon: "award",
    title: "1st place, GeeksforGeeks Hackathon",
    detail: "Google Cloud and AMD.",
  },
  {
    icon: "pr",
    title: "Top 10, JGEC Winter of Code",
    detail: "40+ merged pull requests across 6 open-source projects.",
  },
  { icon: "mentor", title: "Mentor, Code4GovTech 2024", detail: null },
  { icon: "mic", title: "Speaker, FOSS United Lucknow", detail: null },
];
