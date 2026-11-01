import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, MotionConfig, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Mail, Github, Linkedin, ArrowUpRight, ArrowUp, Copy, Menu, X, Award, GraduationCap, Mic,
  Code2, FileText, Download, Eye, MapPin, Briefcase, Sun, Moon, Search, Trophy, Sigma,
  GitPullRequest, Users, Hash, CornerDownLeft, FolderGit2, Lightbulb, Rocket, Network,
} from "lucide-react";
import { profile, stats, strengths, experience, projects, skills, education, achievements } from "./content";

/* ─── Helpers ─── */
const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];
const SECTIONS = ["home", ...NAV.map((item) => item.id)];

const SOCIALS = [
  { label: "LinkedIn", href: profile.links.linkedin, icon: Linkedin },
  { label: "GitHub", href: profile.links.github, icon: Github },
  { label: "LeetCode", href: profile.links.leetcode, icon: Code2 },
];

// Icon names used in content.js
const CONTENT_ICONS = {
  product: Lightbulb, build: Rocket, scale: Network,
  trophy: Trophy, math: Sigma, award: Award, pr: GitPullRequest, mentor: Users, mic: Mic,
};

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

const BTN_PRIMARY =
  "inline-flex items-center gap-2 rounded-lg bg-accent-strong px-4 py-2.5 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90";
const BTN_SECONDARY =
  "inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent cursor-pointer";
const BTN_ICON =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent/50 hover:text-accent";

function scrollToSection(id) {
  // Default behavior follows the CSS scroll-behavior, so reduced-motion users get an instant jump.
  document.getElementById(id)?.scrollIntoView();
}

function openExternal(href) {
  window.open(href, "_blank", "noopener,noreferrer");
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");

  // Only an explicit toggle is saved; until then the page follows the system setting (see index.html).
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked: the theme still applies for this visit */
    }
    setTheme(next);
  };

  return [theme, toggle];
}

function useToast() {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const show = useCallback((text) => {
    clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(null), 2500);
  }, []);

  return [message, show];
}

/* ─── Small building blocks ─── */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="scroll-mt-16 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-accent">// {eyebrow}</p>
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Kbd({ children }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted">
      {children}
    </kbd>
  );
}

// Renders **phrase** from content.js as bold.
function Emphasis({ text }) {
  return text.split("**").map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function ContentIcon({ name, size }) {
  const Icon = CONTENT_ICONS[name] ?? Award;
  return <Icon size={size} />;
}

function Bullets({ items, className = "" }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="relative pl-4 text-sm leading-relaxed text-body">
          <span aria-hidden="true" className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
          <Emphasis text={item} />
        </li>
      ))}
    </ul>
  );
}

/* ─── Scroll progress ─── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
    />
  );
}

/* ─── Navbar ─── */
function Navbar({ active, theme, onToggleTheme, onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        open ? "border-line bg-page" : scrolled ? "border-line bg-page/85 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#home" aria-label={`${profile.name}, back to top`} className="font-mono text-lg font-bold tracking-tight">
          <span className="text-accent">&lt;</span>
          <span className="text-ink">AB</span>
          <span className="text-accent"> /&gt;</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active === item.id ? "text-accent" : "text-muted hover:text-ink"
              }`}
            >
              {active === item.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-accent-soft"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Search"
            className="hidden h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-3 text-xs text-muted transition-colors hover:text-ink md:inline-flex"
          >
            <Search size={14} />
            <span className="hidden lg:inline">Search</span>
            <Kbd>{IS_MAC ? "⌘K" : "Ctrl K"}</Kbd>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active === item.id ? "bg-accent-soft text-accent" : "text-body hover:bg-surface-2"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─── Hero ─── */
function Hero() {
  const fadeIn = (delay) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="home" className="relative overflow-hidden px-4 pb-4 pt-32 sm:px-6 sm:pt-40">
      <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-5xl">
        <motion.p
          {...fadeIn(0)}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.availability}
        </motion.p>

        <motion.h1 {...fadeIn(0.05)} className="mt-6 text-4xl font-bold tracking-tight text-ink sm:text-6xl">
          {profile.name}
        </motion.h1>

        <motion.p {...fadeIn(0.1)} className="mt-5 max-w-3xl text-xl font-medium leading-snug text-ink sm:text-2xl">
          {profile.headline}
        </motion.p>

        <motion.p {...fadeIn(0.15)} className="mt-5 max-w-2xl leading-relaxed text-body">
          {profile.bio}
        </motion.p>

        <motion.ul {...fadeIn(0.2)} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <li className="inline-flex items-center gap-1.5">
            <Briefcase size={15} />
            {profile.current}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <MapPin size={15} />
            {profile.location}
          </li>
        </motion.ul>

        <motion.div {...fadeIn(0.25)} className="mt-8 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} className={BTN_PRIMARY}>
            <Mail size={16} />
            Email me
          </a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
            <FileText size={16} />
            Resume
          </a>
          <div className="flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className={BTN_ICON}
              >
                <social.icon size={17} />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.dl
          {...fadeIn(0.35)}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end gap-1.5 bg-surface p-5">
              <dt className="text-xs leading-snug text-muted">{stat.label}</dt>
              <dd className="font-mono text-xl font-bold text-ink sm:text-2xl">{stat.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

/* ─── Strengths ─── */
function Strengths() {
  return (
    <Section id="about" eyebrow="About" title="What I bring">
      <div className="grid gap-6 md:grid-cols-3">
        {strengths.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <ContentIcon name={item.icon} size={20} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{item.summary}</p>
              <Bullets items={item.points} className="mt-5 border-t border-line pt-5" />
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Experience ─── */
function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <div className="space-y-6">
        {experience.map((job) => (
          <Reveal key={job.company}>
            <article className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink">{job.company}</h3>
                    {job.current && (
                      <span className="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-body">
                    {job.role} · {job.location}
                  </p>
                  {job.note && <p className="mt-0.5 text-xs text-muted">{job.note}</p>}
                </div>
                <p className="shrink-0 font-mono text-xs text-muted">{job.period}</p>
              </header>

              <p className="mt-5 rounded-xl bg-surface-2 p-4 text-sm leading-relaxed text-body">{job.context}</p>

              <ul className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
                {job.highlights.map((item) => (
                  <li key={item.title} className="relative pl-4">
                    <span aria-hidden="true" className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                    <h4 className="text-sm font-semibold text-ink">{item.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-body">
                      <Emphasis text={item.text} />
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Projects ─── */
function ProjectLinks({ links }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {link.label === "Source" ? <Github size={14} /> : <ArrowUpRight size={14} />}
          {link.label}
        </a>
      ))}
    </div>
  );
}

function Projects() {
  const [featured, ...others] = projects;

  return (
    <Section id="projects" eyebrow="Projects" title="Selected projects">
      <Reveal>
        <article className="grid gap-8 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted">{featured.period}</span>
              <span className="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                Latest
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-bold text-ink">{featured.name}</h3>
            <p className="mt-1 text-sm font-medium text-accent">{featured.kind}</p>
            <p className="mt-4 leading-relaxed text-body">{featured.description}</p>
            <div className="mt-6 lg:mt-auto lg:pt-6">
              <ProjectLinks links={featured.links} />
            </div>
          </div>
          <Bullets items={featured.highlights} className="lg:border-l lg:border-line lg:pl-8" />
        </article>
      </Reveal>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {others.map((project, i) => (
          <Reveal key={project.name} delay={i * 0.06} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/40">
              <span className="font-mono text-xs text-muted">{project.period}</span>
              <h3 className="mt-2 font-semibold text-ink">{project.name}</h3>
              <p className="mt-0.5 text-sm text-accent">{project.kind}</p>
              <p className="mt-3 text-sm leading-relaxed text-body">{project.description}</p>
              {project.highlights.length > 0 && <Bullets items={project.highlights} className="mt-4" />}
              <div className="mt-auto pt-5">
                <ProjectLinks links={project.links} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Skills ─── */
function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      <Reveal>
        <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {skills.map((group) => (
            <div key={group.group} className="grid gap-3 p-5 sm:grid-cols-[180px_1fr] sm:items-baseline sm:px-8">
              <h3 className="text-sm font-semibold text-ink">{group.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-body"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ─── Education & Achievements ─── */
function Education() {
  return (
    <Section id="education" eyebrow="Background" title="Education and achievements">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Reveal className="h-full">
          <article className="h-full rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <GraduationCap size={22} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-ink">{education.school}</h3>
            <p className="mt-1 text-sm text-body">{education.degree}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-2 p-3">
                <dt className="text-xs text-muted">Years</dt>
                <dd className="mt-0.5 font-mono text-sm font-semibold text-ink">{education.period}</dd>
              </div>
              <div className="rounded-xl bg-surface-2 p-3">
                <dt className="text-xs text-muted">CGPA</dt>
                <dd className="mt-0.5 font-mono text-sm font-semibold text-ink">{education.cgpa}</dd>
              </div>
            </dl>
          </article>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {achievements.map((item) => (
              <li key={item.title} className="flex gap-3 rounded-xl border border-line bg-surface p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <ContentIcon name={item.icon} size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  {item.detail && <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─── Contact ─── */
function Contact({ onCopyEmail }) {
  return (
    <Section id="contact" eyebrow="Contact" title="Let's talk">
      <Reveal>
        <div className="grid gap-10 rounded-2xl border border-line bg-surface p-6 sm:p-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-body">
              I'm based in {profile.location}, and open to roles anywhere in India.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className={BTN_PRIMARY}>
                <Mail size={16} />
                Email me
              </a>
              <button type="button" onClick={onCopyEmail} className={BTN_SECONDARY}>
                <Copy size={16} />
                Copy email
              </button>
            </div>
            <p className="mt-4 break-all font-mono text-sm text-muted">{profile.email}</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted">Resume</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={BTN_SECONDARY}>
                  <Eye size={16} />
                  View PDF
                </a>
                <a href={profile.resume} download className={BTN_SECONDARY}>
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted">Elsewhere</h3>
              <ul className="mt-3 space-y-2.5">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-accent"
                    >
                      <social.icon size={16} />
                      {social.label}
                      <ArrowUpRight size={14} className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ─── Footer ─── */
function Footer({ onOpenPalette }) {
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden cursor-pointer items-center gap-1.5 transition-colors hover:text-ink sm:inline-flex"
        >
          Press <Kbd>{IS_MAC ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd> to jump anywhere
        </button>
      </div>
    </footer>
  );
}

/* ─── Back to top ─── */
function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 800));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => scrollToSection("home")}
          aria-label="Back to top"
          className="fixed bottom-6 right-4 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted shadow-lg transition-colors hover:text-accent sm:right-6"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ─── Toast ─── */
function Toast({ message }) {
  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[80] flex justify-center px-4 sm:bottom-6">
        <AnimatePresence>
          {message && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-ink shadow-xl"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ─── Command palette (⌘K / Ctrl+K) ─── */
function CommandPalette({ actions, onClose }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  // Captured during the first render, before the input takes focus.
  const [previousFocus] = useState(() => document.activeElement);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const q = query.trim().toLowerCase();
  const results = q ? actions.filter((a) => `${a.label} ${a.group}`.toLowerCase().includes(q)) : actions;
  const selected = Math.min(index, results.length - 1);

  useEffect(() => {
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [previousFocus]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const run = (action) => {
    onClose();
    action.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // Keep focus in the search box; options are reached with the arrow keys.
      e.preventDefault();
    } else if (results.length === 0) {
      return;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((selected + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((selected - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[selected]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
    >
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onKeyDown={onKeyDown}
        initial={{ y: -8, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -8, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-autocomplete="list"
            aria-activedescendant={selected >= 0 ? `command-${results[selected].id}` : undefined}
            placeholder="Search sections, links and actions"
            className="h-12 w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        {results.length > 0 ? (
          <ul id="command-list" role="listbox" ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {results.map((action, i) => (
              <li
                key={action.id}
                id={`command-${action.id}`}
                role="option"
                aria-selected={i === selected}
                onMouseMove={() => setIndex(i)}
                onClick={() => run(action)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  i === selected ? "bg-accent-soft text-accent" : "text-body"
                }`}
              >
                <action.icon size={16} className="shrink-0" />
                <span className="flex-1 truncate">{action.label}</span>
                <span className="text-xs text-muted">{action.group}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-muted">No matches for “{query}”</p>
        )}

        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            to move
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>
              <CornerDownLeft size={10} />
            </Kbd>
            to select
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [active, setActive] = useState("home");
  const [theme, toggleTheme] = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, showToast] = useToast();

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

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      showToast("Email copied to clipboard");
    } catch {
      showToast(profile.email);
    }
  };

  const actions = [
    ...NAV.map((item) => ({
      id: `go-${item.id}`,
      label: `Go to ${item.label}`,
      group: "Navigate",
      icon: Hash,
      run: () => scrollToSection(item.id),
    })),
    { id: "copy-email", label: "Copy email address", group: "Contact", icon: Copy, run: copyEmail },
    {
      id: "send-email",
      label: "Send an email",
      group: "Contact",
      icon: Mail,
      run: () => {
        window.location.href = `mailto:${profile.email}`;
      },
    },
    { id: "resume", label: "Open resume (PDF)", group: "Contact", icon: FileText, run: () => openExternal(profile.resume) },
    ...SOCIALS.map((social) => ({
      id: slug(social.label),
      label: `Open ${social.label}`,
      group: "Links",
      icon: social.icon,
      run: () => openExternal(social.href),
    })),
    ...projects.flatMap((project) =>
      project.links.map((link) => ({
        id: slug(`${project.name} ${link.label}`),
        label: `${project.name} (${link.label.toLowerCase()})`,
        group: "Projects",
        icon: FolderGit2,
        run: () => openExternal(link.href),
      }))
    ),
    {
      id: "theme",
      label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      group: "Settings",
      icon: theme === "dark" ? Sun : Moon,
      run: toggleTheme,
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-ink focus:shadow-lg"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar
        active={active}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <main id="main">
        <Hero />
        <Strengths />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact onCopyEmail={copyEmail} />
      </main>
      <Footer onOpenPalette={() => setPaletteOpen(true)} />
      <BackToTop />
      <Toast message={toast} />
      <AnimatePresence>
        {paletteOpen && <CommandPalette actions={actions} onClose={() => setPaletteOpen(false)} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
