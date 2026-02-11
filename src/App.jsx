import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Mail, Github, Linkedin, ExternalLink, Copy, Check, ChevronDown,
  Terminal, Shield, Cloud, Cog, BarChart3, Lock, Bot, Zap, Server,
  Menu, X, Award, GraduationCap, Mic, Code2, ArrowUpRight, Cpu,
  Database, Globe, Layers, Monitor
} from "lucide-react";

/* ─── Helpers ─── */
const SECTIONS = ["home", "experience", "projects", "skills", "achievements"];

function useTypewriter(texts, speed = 60, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }
    setDisplay(current.substring(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed, pause]);

  return display;
}

/* ─── Section wrapper with scroll reveal ─── */
function Section({ id, children, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id={id} ref={ref} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

/* ─── Animated background mesh ─── */
function MeshBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="mesh-orb w-[500px] h-[500px] bg-emerald-500/20 -top-48 -left-48" style={{ animationDelay: "0s" }} />
      <div className="mesh-orb w-[600px] h-[600px] bg-violet-500/15 top-1/3 -right-64" style={{ animationDelay: "-7s" }} />
      <div className="mesh-orb w-[400px] h-[400px] bg-blue-500/10 bottom-0 left-1/3" style={{ animationDelay: "-14s" }} />
      <div className="grid-bg fixed inset-0" />
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "achievements", label: "Achievements" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#home"
            className="font-mono font-bold text-lg tracking-tight"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-emerald-400">&lt;</span>
            <span className="text-white">AB</span>
            <span className="text-emerald-400"> /&gt;</span>
          </motion.a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                  active === item.id
                    ? "text-emerald-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {active === item.id && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-emerald-400/10 rounded-lg"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-slate-800/50 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active === item.id
                      ? "text-emerald-400 bg-emerald-400/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const typed = useTypewriter(
    [
      "Architecting scalable cloud solutions.",
      "Building high-performance automation engines.",
      "Engineering zero-downtime migrations.",
      "Securing enterprise infrastructure.",
    ],
    50,
    2500
  );

  const stats = [
    { value: "600+", label: "DSA Problems Solved", icon: Code2 },
    { value: "40%", label: "Latency Reduction", icon: Zap },
    { value: "Zero", label: "Downtime Migrations", icon: Server },
  ];

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-32">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-mono mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for opportunities
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-white">Hi, I'm </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Anushka
              </span>
              <br />
              <span className="text-white">Bhandari</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-mono text-emerald-400/80 text-sm sm:text-base"
            >
              Backend Systems Specialist &amp; Infrastructure Engineer
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="font-mono text-slate-400 text-sm sm:text-base h-8"
            >
              <span className="text-violet-400">$</span> {typed}
              <span className="cursor-blink text-emerald-400">|</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed"
            >
              A passionate Software Engineer with a focus on{" "}
              <span className="text-white font-medium">Network Security</span>,{" "}
              <span className="text-white font-medium">Cloud Migrations</span>, and{" "}
              <span className="text-white font-medium">Automated Testing Infrastructure</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <a
                href="mailto:bhandaanu123@gmail.com"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-lg transition-all duration-300 glow-emerald-hover"
              >
                <Mail size={16} />
                Get in Touch
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="https://linkedin.com/in/Anushka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-700 hover:border-emerald-400/50 text-slate-300 hover:text-emerald-400 font-medium text-sm rounded-lg transition-all duration-300 hover:bg-emerald-400/5"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href="https://github.com/Anushka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-sm rounded-lg transition-all duration-300 hover:bg-white/5"
              >
                <Github size={16} />
                GitHub
              </a>
            </motion.div>
          </div>

          {/* Right: Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6 glow-emerald float-animation">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <Terminal size={16} className="text-emerald-400" />
                <span className="font-mono text-xs text-slate-400">system_metrics.sh</span>
                <div className="ml-auto flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
              </div>
              <div className="space-y-5">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                      <stat.icon size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-xl text-white">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50">
                <div className="font-mono text-xs text-slate-500">
                  <span className="text-emerald-400">~</span> last updated: live
                  <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-slate-500">scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={16} className="text-slate-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Section header ─── */
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <p className="font-mono text-emerald-400 text-sm mb-3 tracking-wider uppercase">{eyebrow}</p>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

/* ─── Experience ─── */
function Experience() {
  const roles = [
    {
      title: "Software Engineer",
      company: "Native Bridge",
      location: "Bangalore",
      period: "July 2025 – Present",
      current: true,
      highlights: [
        {
          icon: Shield,
          tag: "Security",
          color: "text-red-400 bg-red-400/10",
          text: "TCP Proxy Gateway: Engineered a custom TCP proxy service in Python to intercept ADB requests. Implemented granular blocking and whitelisting at the proxy level, securing device connections for enterprise clients.",
        },
        {
          icon: Cloud,
          tag: "Cloud",
          color: "text-blue-400 bg-blue-400/10",
          text: "Cloud Migration (GCP to AWS): Executed a zero-downtime migration of the entire storage backend from Google Cloud Storage to AWS S3.",
        },
        {
          icon: Cog,
          tag: "DevOps",
          color: "text-amber-400 bg-amber-400/10",
          text: "High-Performance Logging: Architected a real-time log collection pipeline flushing data to Betterstack and AWS Glacier, enabling millisecond-level timeline tracking and instant incident turnaround.",
        },
        {
          icon: Layers,
          tag: "Automation",
          color: "text-emerald-400 bg-emerald-400/10",
          text: "Appium Test Engine: Built a Dockerized Appium execution engine (v1 & v2) supporting Python/Java with automated workspace provisioning.",
        },
        {
          icon: BarChart3,
          tag: "Product",
          color: "text-violet-400 bg-violet-400/10",
          text: "Device Analytics Platform: Built a system capturing 20+ metrics (CPU, FPS, Janky frames) while reducing ADB overhead by 62%.",
        },
        {
          icon: Lock,
          tag: "Security",
          color: "text-red-400 bg-red-400/10",
          text: "RBAC & OAuth: Implemented Access Control for app assets and integrated Slack/Jira/GitHub via OAuth 2.0.",
        },
      ],
    },
    {
      title: "Software Engineering Intern",
      company: "Native Bridge",
      location: "Remote",
      period: "Jan 2025 – July 2025",
      current: false,
      highlights: [
        {
          icon: Bot,
          tag: "AI",
          color: "text-pink-400 bg-pink-400/10",
          text: "AI Integration: Built an AI-powered debugging assistant using OpenAI APIs to auto-explain APK errors to users.",
        },
        {
          icon: Zap,
          tag: "Backend",
          color: "text-yellow-400 bg-yellow-400/10",
          text: "Backend Optimization: Designed a pre-allocated Android session management system, reducing startup latency by 40%.",
        },
        {
          icon: Server,
          tag: "Infra",
          color: "text-cyan-400 bg-cyan-400/10",
          text: "Infrastructure: Deployed Ghost CMS on GCP with Docker/NGINX/SSL.",
        },
        {
          icon: Mail,
          tag: "Engagement",
          color: "text-green-400 bg-green-400/10",
          text: "User Engagement: Built a contextual email trigger service handling 20+ unique user journey scenarios.",
        },
      ],
    },
  ];

  return (
    <Section id="experience" className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="// Experience"
          title="Where I've Built Things"
          subtitle="My professional journey building production systems at scale."
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px timeline-line hidden md:block" />

          <div className="space-y-16">
            {roles.map((role, roleIdx) => (
              <motion.div
                key={roleIdx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: roleIdx * 0.2 }}
                className="relative md:pl-20"
              >
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-5 top-1 w-7 h-7 rounded-full bg-slate-950 border-2 border-emerald-400 items-center justify-center z-10">
                  <div className={`w-2.5 h-2.5 rounded-full ${role.current ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                </div>

                {/* Role header */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{role.title}</h3>
                    {role.current && (
                      <span className="px-2 py-0.5 text-xs font-mono bg-emerald-400/10 text-emerald-400 rounded-full border border-emerald-400/30">
                        current
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-sm text-emerald-400">
                    @ {role.company}{" "}
                    <span className="text-slate-500">
                      · {role.location} · {role.period}
                    </span>
                  </p>
                </div>

                {/* Highlights */}
                <div className="grid gap-3">
                  {role.highlights.map((hl, hlIdx) => (
                    <motion.div
                      key={hlIdx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * hlIdx }}
                      whileHover={{ x: 4 }}
                      className="glass rounded-xl p-4 group hover:border-emerald-400/20 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${hl.color.split(" ")[1]}`}>
                          <hl.icon size={16} className={hl.color.split(" ")[0]} />
                        </div>
                        <div className="min-w-0">
                          <span className={`inline-block px-2 py-0.5 text-xs font-mono rounded-md mb-2 ${hl.color}`}>
                            {hl.tag}
                          </span>
                          <p className="text-sm text-slate-300 leading-relaxed">{hl.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Projects ─── */
function Projects() {
  const projects = [
    {
      title: "BridgeLink",
      tagline: "Remote Android Device Access via NativeBridge.",
      description:
        "A production-ready CLI tool that exposes local Android devices (USB/WiFi) remotely via secure tunnels (powered by bore). Features auto-activation, health monitoring, and a beautiful terminal interface.",
      link: "https://nativebridge.io/dashboard/bridgelink",
      tech: ["Python", "bore tunnels", "ADB", "CLI", "Health Monitoring"],
      icon: Monitor,
      gradient: "from-emerald-400 to-cyan-400",
      star: true,
    },
    {
      title: "DaanGo Live",
      tagline: "Social Impact Fundraising Platform.",
      description:
        "A MERN stack platform for creating and managing fundraisers. Integrated Stripe for donations and JWT/OTP for secure authentication.",
      link: null,
      tech: ["MongoDB", "Express", "React", "Node.js", "Stripe", "JWT"],
      icon: Globe,
      gradient: "from-violet-400 to-pink-400",
      star: false,
    },
  ];

  return (
    <Section id="projects" className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="// Projects"
          title="Things I've Shipped"
          subtitle="Production systems and passion projects that solve real problems."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative glass rounded-2xl overflow-hidden transition-all duration-500 hover:border-emerald-400/30 glow-emerald-hover"
            >
              {/* Gradient top bar */}
              <div className={`h-1 bg-gradient-to-r ${proj.gradient}`} />

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${proj.gradient} p-0.5`}>
                    <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                      <proj.icon size={22} className="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {proj.star && (
                      <span className="px-2 py-0.5 text-xs font-mono bg-amber-400/10 text-amber-400 rounded-full border border-amber-400/30">
                        Star Project
                      </span>
                    )}
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="font-mono text-xs text-slate-400 mb-4">{proj.tagline}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{proj.description}</p>

                <div className="flex flex-wrap gap-2">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-xs font-mono bg-slate-800/50 text-slate-300 rounded-md border border-slate-700/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Skills ─── */
function Skills() {
  const groups = [
    {
      title: "Languages",
      icon: Code2,
      color: "emerald",
      items: ["Python", "C++", "JavaScript", "Java"],
    },
    {
      title: "Core CS",
      icon: Cpu,
      color: "violet",
      items: ["DSA", "OOP", "System Design", "OS", "DBMS"],
    },
    {
      title: "Backend & Cloud",
      icon: Database,
      color: "blue",
      items: ["FastAPI", "Docker", "Kubernetes", "AWS S3", "AWS Glacier", "GCP", "NGINX", "MongoDB", "Redis"],
    },
    {
      title: "Frontend",
      icon: Layers,
      color: "pink",
      items: ["React.js", "Tailwind", "Framer Motion"],
    },
  ];

  const colorMap = {
    emerald: {
      icon: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      chip: "hover:border-emerald-400/50 hover:shadow-emerald-400/20",
    },
    violet: {
      icon: "text-violet-400",
      bg: "bg-violet-400/10",
      border: "border-violet-400/20",
      chip: "hover:border-violet-400/50 hover:shadow-violet-400/20",
    },
    blue: {
      icon: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      chip: "hover:border-blue-400/50 hover:shadow-blue-400/20",
    },
    pink: {
      icon: "text-pink-400",
      bg: "bg-pink-400/10",
      border: "border-pink-400/20",
      chip: "hover:border-pink-400/50 hover:shadow-pink-400/20",
    },
  };

  return (
    <Section id="skills" className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="// Skills"
          title="Tech Arsenal"
          subtitle="Technologies and paradigms I work with daily."
        />

        <div className="grid sm:grid-cols-2 gap-6">
          {groups.map((group, gi) => {
            const c = colorMap[group.color];
            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.1 }}
                className={`glass rounded-2xl p-6 border ${c.border}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <group.icon size={18} className={c.icon} />
                  </div>
                  <h3 className="font-mono font-semibold text-white">{group.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, ii) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.1 + ii * 0.05 }}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className={`skill-chip px-3 py-1.5 text-sm font-mono bg-slate-800/50 text-slate-300 rounded-lg border border-slate-700/50 cursor-default ${c.chip}`}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─── Achievements & Education ─── */
function Achievements() {
  const items = [
    {
      icon: GraduationCap,
      title: "B.Tech, NIT Jamshedpur",
      detail: "CGPA 8.24",
      color: "text-emerald-400 bg-emerald-400/10",
    },
    {
      icon: Award,
      title: "Solving for India Hackathon",
      detail: "Winner of Regional Round (GeeksForGeeks)",
      color: "text-amber-400 bg-amber-400/10",
    },
    {
      icon: Code2,
      title: "Open Source Mentor",
      detail: "Mentored contributors for iGOT Karmayogi (Code4GovTech 2024)",
      color: "text-violet-400 bg-violet-400/10",
    },
    {
      icon: Cpu,
      title: "Competitive Coding",
      detail: "Ranked 10th globally in JGEC Winter of Code. Solved 600+ problems. AIR 29 in Regional Math Olympiad.",
      color: "text-cyan-400 bg-cyan-400/10",
    },
    {
      icon: Mic,
      title: "FOSS United Speaker",
      detail: "Speaker at FOSS United Lucknow — Open Source for Social Impact",
      color: "text-pink-400 bg-pink-400/10",
    },
  ];

  return (
    <Section id="achievements" className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="// Achievements & Education"
          title="Milestones"
          subtitle="Highlights from my academic and extracurricular journey."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-xl p-5 transition-all duration-300 hover:border-emerald-400/20 glow-emerald-hover"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${item.color.split(" ")[1]}`}>
                <item.icon size={20} className={item.color.split(" ")[0]} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Footer / Contact ─── */
function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "bhandaanu123@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <footer className="relative py-20 px-4 sm:px-6 border-t border-slate-800/50">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-emerald-400 text-sm mb-3">// Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let's Build Something</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Open to exciting roles, collaborations, and conversations about scalable systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition-all duration-300 glow-emerald-hover"
            >
              <Mail size={18} />
              Send Email
            </a>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-emerald-400/50 text-slate-300 hover:text-emerald-400 font-medium rounded-lg transition-all duration-300 hover:bg-emerald-400/5 cursor-pointer"
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              {copied ? "Copied!" : "Copy Email"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href="https://linkedin.com/in/Anushka"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-slate-500 hover:text-emerald-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://github.com/Anushka"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-slate-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={`mailto:${email}`}
              className="p-2.5 text-slate-500 hover:text-emerald-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/50">
            <p className="font-mono text-xs text-slate-600">
              Designed &amp; built by Anushka Bhandari
            </p>
          </div>
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 glass-strong rounded-xl px-5 py-3 flex items-center gap-2 shadow-xl"
          >
            <Check size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-white">Email copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 noise-overlay">
      <MeshBackground />
      <Navbar active={active} />
      <main className="relative z-10">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
      </main>
      <Footer />
    </div>
  );
}
