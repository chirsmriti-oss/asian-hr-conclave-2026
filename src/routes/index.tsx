import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Linkedin, Instagram } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asian HR Conclave & Top CHRO Awards Night 2026 | Asia INC 500" },
      {
        name: "description",
        content:
          "Celebrating India's Top Human Resources Leaders. Leading in the Age of Artificial Intelligence. Presented by Asia INC 500.",
      },
      { property: "og:title", content: "Asian HR Conclave & Top CHRO Awards Night 2026" },
      {
        property: "og:description",
        content:
          "A landmark one day programme celebrating India's Top HR Leaders across 12+ sector specific award categories.",
      },
    ],
  }),
  component: Home,
});

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#vision", label: "Vision" },
  { href: "#programme", label: "Programme" },
  { href: "#awards", label: "Awards" },
  { href: "#speakers", label: "Speakers" },
  { href: "#invite", label: "Invitation" },
  { href: "#director", label: "Contact" },
];

const objectives = [
  "Recognise and celebrate India's Top HR Leaders across 15+ sector specific and thematic award categories",
  "Create nationwide media visibility for Asia INC 500 and the honoured CHROs through AI ready thought leadership, digital storytelling, print coverage, and social media amplification",
  "Facilitate high level dialogue on the Future of Work, AI Driven Talent Acquisition, and the Evolving Role of the CHRO",
  "Convene India's most influential HR decision makers in one carefully curated room",
  "Strengthen the corporate HR ecosystem through peer to peer exchange, partnerships, and strategic collaborations",
  "Set a new benchmark for how India recognises HR leadership at the highest level",
  "Establish a merit first recognition platform where awardees are invited and honoured based on leadership impact, with no participation fee required for recognition",
];

const outcomes = [
  { area: "HR Leader Recognition", metric: "Top HR Leaders honoured across 12+ award categories" },
  { area: "Delegate Attendance", metric: "200+ senior HR leaders, CEOs and industry stakeholders" },
  { area: "Media Coverage", metric: "National business media coverage across digital, print, video, and social" },
  { area: "Peer Networking", metric: "Curated boardroom style interactions between India's most senior HR voices" },
  { area: "Partnership Signals", metric: "Cross sector collaborations initiated between honoured organisations" },
  { area: "Category Benchmarking", metric: "A definitive annual reference on India's leading HR practitioners" },
  { area: "Thought Leadership", metric: "Publishable insights and keynote content across the AI and HR agenda" },
  { area: "Brand Prestige", metric: "Association with India's most credible CHRO recognition programme" },
];

const programme: Array<{ t: string; title: string; details: string[] }> = [
  { t: "9:30 AM to 10:30 AM", title: "Welcome and Coffee", details: ["Delegate check in and welcome kit distribution", "Informal networking over coffee"] },
  { t: "10:30 AM to 11:00 AM", title: "Inaugural Ceremony: Introduction to the event theme and agenda", details: ["Traditional lamp lighting ceremony and welcome address", "Opening remarks by Asia INC 500 and agenda overview"] },
  { t: "11:00 AM to 11:15 AM", title: "Opening Keynote", details: ["Address by a distinguished keynote speaker on HR leadership and AI"] },
  { t: "11:15 AM to 12:00 PM", title: "Panel Discussion 1", details: ["Senior CHROs discuss AI powered talent acquisition", "Panelists from Technology, BFSI, and Manufacturing sectors"] },
  { t: "12:00 PM to 12:30 PM", title: "Roundtable Discussion", details: ["Structured roundtable with CHROs and industry leaders", "Focus on bridging the skills gap between academia and industry"] },
  { t: "12:30 PM to 1:00 PM", title: "Lunch", details: ["Networking lunch with facilitated interaction among delegates"] },
  { t: "1:00 PM to 1:30 PM", title: "Buffer Break", details: ["Informal networking and short break"] },
  { t: "1:30 PM to 2:30 PM", title: "CHRO Leadership HR & AI Roundtable", details: ["Discussion on the skills economy and future workforce needs", "Focus on what companies actually need from emerging talent"] },
  { t: "2:30 PM to 3:00 PM", title: "AI Enabled Campus Presentation by Chitkara University", details: ["Overview of academic programs and AI enabled learning initiatives", "Placement data, graduate profiles, and corporate partnerships"] },
  { t: "3:00 PM to 3:30 PM", title: "High Tea & Networking Coffee", details: ["Informal networking among delegates and guests"] },
  { t: "3:30 PM to 4:00 PM", title: "Final Keynote", details: ["Closing keynote address on India's HR leadership landscape"] },
  { t: "4:00 PM to 6:00 PM", title: "Awards Ceremony", details: ["Top CHRO Awards presented across key industry categories", "Grand Award. CHRO of the Year, India 2026"] },
  { t: "6:00 PM to 6:30 PM", title: "Vote of Thanks & Conclusion", details: ["Closing remarks by Asia INC 500", "Formal close of the programme"] },
];

const awards = [
  { sector: "Grand Honour", title: "Asia Inc. 500 CHRO of the Year", desc: "The highest individual honour recognizing an exceptional CHRO for strategic leadership, people transformation, and measurable business impact." },
  { sector: "Lifetime Recognition", title: "Asia Inc. 500 Lifetime Achievement Award", desc: "Honouring an HR leader whose decades of contribution have shaped the profession through leadership, mentorship, and people excellence." },
  { sector: "Leadership", title: "Visionary People Leader Award", desc: "Recognizing an HR leader who has aligned people strategy with business goals while driving innovation, resilience, and sustainable growth." },
  { sector: "Transformation", title: "People Transformation Excellence Award", desc: "Celebrating HR leaders who have led large scale cultural change, modernized HR practices, and improved workforce effectiveness." },
  { sector: "AI & Innovation", title: "AI & HR Innovation Award", desc: "Recognizing excellence in using AI, automation, analytics, and digital innovation to transform HR and employee experience." },
  { sector: "Future of Work", title: "Future Workforce Leadership Award", desc: "Celebrating HR leaders preparing organizations for tomorrow through workforce planning, reskilling, succession, and future ready talent." },
  { sector: "Employer Brand", title: "Employer Brand Excellence Award", desc: "Recognizing organizations and HR leaders who have built trusted employer brands that attract, engage, and retain top talent." },
  { sector: "Learning & Development", title: "Talent Development Excellence Award", desc: "Honouring HR leaders committed to learning, leadership development, capability building, and career growth." },
  { sector: "Employee Experience", title: "Employee Experience Excellence Award", desc: "Recognizing organizations creating exceptional employee journeys through wellbeing, engagement, inclusion, and people first culture." },
  { sector: "Culture", title: "Culture Excellence Award", desc: "Celebrating HR leaders who have built strong cultures based on trust, collaboration, innovation, integrity, and shared values." },
  { sector: "Manufacturing", title: "Manufacturing People Excellence Award", desc: "Recognizing HR leaders in manufacturing who have built skilled, engaged, productive workforces with strong safety and operational practices." },
  { sector: "Healthcare & Pharma", title: "Healthcare & Pharma People Excellence Award", desc: "Honouring HR leaders in healthcare and pharma for excellence in talent, innovation, compassion, and patient focused organizations." },
  { sector: "IT & Technology", title: "IT & Technology People Excellence Award", desc: "Recognizing HR leaders building agile, innovative, high performing technology organizations through digital capability and learning." },
  { sector: "Financial Services", title: "Financial Services People Excellence Award", desc: "Recognizing HR leadership across BFSI and fintech for building resilient, customer centric, high performing teams." },
  { sector: "Consumer & Retail", title: "Consumer & Retail People Excellence Award", desc: "Recognizing HR leaders who build people centric retail and consumer organizations through engagement, frontline leadership, and innovation." },
];




function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Counter({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * to));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  const ref = useReveal<HTMLElement>();
  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  );
}

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heroY, setHeroY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (y / h) * 100 : 0);
      setHeroY(Math.min(y * 0.25, 180));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-midnight">
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-gradient-to-r from-gold via-gold-soft to-gold transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      {/* NAV */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-midnight/90 backdrop-blur-xl border-b border-gold/15 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.4)]"
            : "bg-midnight/70 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-16 lg:h-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <a href="#top" className="flex min-w-0 items-center gap-3 group">
            <div className="shrink-0 h-9 w-9 rounded-full border border-gold/60 bg-cream/95 p-1.5 grid place-items-center transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-cream">
              <img
                src="/invitation-partner-logo.png"
                alt="Asian HR Conclave"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-cream font-display text-base lg:text-lg tracking-wide">
                Asian HR Conclave
              </div>
              <div className="truncate text-gold/80 text-[10px] tracking-[0.25em] uppercase">
                Presented by Asia INC 500
              </div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-cream/75 hover:text-gold text-sm tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
            <Link to="/register" className="btn-gold btn-gold-hover gold-glow">
              Confirm Your Participation
            </Link>
            <img
              src="/asia-inc-logo.jpeg"
              alt="Asia INC 500"
              className="h-10 w-auto shrink-0 rounded-sm object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden h-10 w-10 grid place-items-center text-cream border border-gold/40 rounded-full"
            aria-label="Menu"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block h-px w-5 bg-gold" />
              <span className="block h-px w-5 bg-gold" />
              <span className="block h-px w-5 bg-gold" />
            </div>
          </button>
        </nav>
        {open && (
          <div className="lg:hidden bg-midnight-deep border-t border-gold/20 px-6 py-6 space-y-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-cream/85 hover:text-gold text-sm tracking-wide"
              >
                {l.label}
              </a>
            ))}
            <Link to="/register" onClick={() => setOpen(false)} className="btn-gold btn-gold-hover w-full justify-center">
              Confirm Your Participation
            </Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-midnight"
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${heroY}px, 0)` }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(201,168,76,0.10),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(245,240,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,1) 1px, transparent 1px)",
              backgroundSize: "96px 96px",
            }}
          />
        </div>

        <div className="absolute top-24 left-6 lg:left-10 h-px w-16 bg-gold/50" aria-hidden />
        <div className="absolute top-24 left-6 lg:left-10 w-px h-16 bg-gold/50" aria-hidden />
        <div className="absolute bottom-24 right-6 lg:right-10 h-px w-16 bg-gold/50" aria-hidden />
        <div className="absolute bottom-24 right-6 lg:right-10 w-px h-16 bg-gold/50" aria-hidden />

        <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10 w-full text-center fade-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="eyebrow">Official Event · 2026</span>
            <span className="h-px w-12 bg-gold/60" />
          </div>

          <h1 className="text-cream font-display font-light text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.75rem] leading-[1.02] tracking-tight">
            Asian HR <span className="italic gold-text">Conclave</span>
            <span className="block mt-2 text-cream/95">& Top CHRO</span>
            <span className="block mt-2 italic gold-text">Awards Night</span>
          </h1>

          <p className="mt-10 mx-auto text-cream/75 text-lg sm:text-xl max-w-2xl leading-relaxed font-light">
            Celebrating India's Top Human Resources Leaders
            <span className="text-gold"> leading in the age of Artificial Intelligence.</span>
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a href="#about" className="btn-gold btn-gold-hover gold-glow">
              Discover the Conclave →
            </a>
            <a href="#programme" className="btn-ghost-gold btn-ghost-gold-hover">
              View Programme
            </a>
          </div>

          <div className="mt-20 mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 max-w-4xl">
              {([
                { k: 20, suf: "+", v: "HR Leaders Honoured", prefix: "" },
                { text: "12+", v: "Hours of Excellence" },
                { k: 200, suf: "+", v: "Senior Leaders", prefix: "" },
                { k: 12, suf: "+", v: "Award Categories", prefix: "" },
              ] as Array<{ k?: number; suf?: string; v: string; prefix?: string; text?: string }>).map((s) => (
                <div key={s.v} className="text-center">
                  <div className={`font-display text-4xl lg:text-5xl text-gold tracking-tight ${s.v === "Hours of Excellence" ? "font-bold" : ""}`}>
                    {s.text ? s.text : <>{s.prefix}<Counter to={s.k!} suffix={s.suf} /></>}
                  </div>
                <div className="mt-2 text-cream/55 text-[10px] tracking-[0.28em] uppercase">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40 text-[10px] tracking-[0.3em] uppercase animate-pulse">
          Scroll
          <div className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </section>

      {/* EVENT AT A GLANCE */}
      <Section className="bg-cream-warm py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            <div className="reveal">
              <span className="eyebrow">Event at a Glance</span>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl leading-tight">
                A one day landmark for India's HR leadership.
              </h2>
              <span className="gold-divider mt-7" />
            </div>
            <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
              {[
                ["Event Date", "11th August 2026"],
                ["Duration", "One Full Day"],
                ["Venue", "Hyatt Regency, Chandigarh"],
                ["Format", "Conclave · Awards Ceremony · Gala Dinner"],
                ["Hosted By", "Asia INC 500, Events & Media Division"],
                ["Dress Code", "Black Tie · Business Formal"],
                ["Awards", "Top HR Leaders in India"],
                ["Expected Audience", "200+ Senior HR Leaders, CEOs & Stakeholders"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`reveal reveal-delay-${(i % 4) + 1} border-l border-gold/40 pl-5`}
                >
                  <dt className="text-[10px] tracking-[0.25em] uppercase text-midnight/50">
                    {k}
                  </dt>
                  <dd className="mt-1.5 font-display text-lg text-midnight">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* ABOUT */}
      <Section id="about" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl reveal">
            <span className="eyebrow">About the Conclave</span>
            <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[1.05]">
              A landmark thought leadership conclave by{" "}
              <span className="italic text-gold">Asia INC 500</span>, honouring India's
              most influential HR leaders.
            </h2>
            <span className="gold-divider mt-8" />
          </div>

          <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-6 text-midnight/80 text-lg leading-relaxed font-light reveal reveal-delay-1">
              <p>
                The Asian HR Conclave & Top CHRO Awards Night 2026 is a
                high impact, single day programme conceived and produced by{" "}
                <strong className="font-medium text-midnight">Asia INC 500</strong> —
                one of Asia's most trusted business media and leadership recognition
                platforms.
              </p>
              <p>
                Asia INC 500 has established itself as a premier platform across Asia,
                running curated rankings of top performing enterprises, executive
                conclaves for C suite dialogue, sector specific industry awards, and
                high value content and research products that serve business leaders,
                investors, and policymakers alike.
              </p>
              <p className="text-midnight">
                Every Asia INC 500 event is deliberately rigorous, exclusive, and
                purposefully networked.
              </p>
            </div>
            <div className="lux-card lux-card-hover p-8 lg:p-10 reveal reveal-delay-2">
              <span className="eyebrow">Strategic Importance</span>
              <p className="mt-5 font-display text-2xl lg:text-3xl leading-snug text-midnight">
                When India's Top HR Leaders convene in one room, they don't just attend —{" "}
                <span className="italic text-gold">they shape the future of work.</span>
              </p>
              <p className="mt-5 text-midnight/70 leading-relaxed">
                Hosting this convening positions the host at the centre of high value strategic
                dialogue with India’s most influential HR leaders, a defining moment for the
                HR community as organizations navigate the future of work in the AI era.
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="mt-24">
            <div className="flex items-end justify-between flex-wrap gap-6 reveal">
              <div>
                <span className="eyebrow">Purpose & Objectives</span>
                <h3 className="mt-3 font-display text-3xl lg:text-4xl">
                  Seven strategic outcomes.
                </h3>
              </div>
              <span className="hairline flex-1 min-w-[120px]" />
            </div>

            <ol className="mt-10 grid md:grid-cols-2 gap-6">
              {objectives.map((o, i) => (
                <li
                  key={i}
                  className={`reveal reveal-delay-${(i % 4) + 1} lux-card lux-card-hover p-7 flex gap-5`}
                >
                  <span className="font-display text-3xl text-gold leading-none shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-midnight/80 leading-relaxed">{o}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* VISION */}
      <Section id="vision" className="bg-midnight text-cream py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,168,76,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="reveal">
              <span className="eyebrow">Vision</span>
              <h2 className="mt-5 font-display text-3xl lg:text-5xl leading-tight text-cream">
                To become India's most impactful annual platform recognising{" "}
                <span className="italic text-gold">HR leadership</span> in the{" "}
                <span className="italic text-gold">AI era</span>.
              </h2>
              <p className="mt-6 text-cream/70 leading-relaxed">
                Driving talent outcomes, industry dialogue, and institutional
                credibility in the age of Artificial Intelligence.
              </p>
            </div>
            <div className="reveal reveal-delay-2">
              <span className="eyebrow">Mission</span>
              <p className="mt-5 font-display text-2xl lg:text-3xl leading-snug text-cream/95">
                To convene India's Top HR Leaders, recognise outstanding HR leadership
                through a world class awards night, and generate lasting partnerships
                and thought leadership across corporate India.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <div className="flex items-center gap-4 mb-10 reveal">
              <span className="gold-divider" />
              <span className="eyebrow">Desired Outcomes</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gold/20 border border-gold/20 rounded-xl overflow-hidden">
              {outcomes.map((o, i) => (
                <div
                  key={o.area}
                  className={`reveal reveal-delay-${(i % 4) + 1} bg-midnight p-6 hover:bg-midnight-deep transition-colors`}
                >
                  <div className="text-gold font-display text-lg">{o.area}</div>
                  <div className="mt-3 h-px w-8 bg-gold/40" />
                  <p className="mt-3 text-cream/70 text-sm leading-relaxed">{o.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* AI IMPERATIVE */}
      <Section className="py-24 lg:py-32 bg-cream">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center reveal">
          <span className="eyebrow">The AI Imperative</span>
          <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[1.05]">
            Why this event matters{" "}
            <span className="italic gold-text">more than ever.</span>
          </h2>
          <span className="gold-divider mx-auto mt-8" />
          <p className="mt-10 text-midnight/75 text-lg lg:text-xl leading-relaxed font-light">
            Artificial Intelligence is fundamentally reshaping how India's largest
            organisations hire, assess, develop, and retain talent. This conclave is
            a structural intervention that convenes the decision makers who are
            defining the next decade of work, and honouring those who lead with
            humanity, rigour, and vision.
          </p>
        </div>
      </Section>

      {/* PROGRAMME */}
      <Section id="programme" className="bg-cream-warm py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl reveal">
            <span className="eyebrow">Programme Schedule</span>
            <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[1.05]">
              One evening. One unforgettable convening.
            </h2>
            <span className="gold-divider mt-8" />
            <p className="mt-6 text-midnight/70 text-lg leading-relaxed">
              A carefully curated flow from reception to gala, culminating in the
              Top CHRO Awards Ceremony.
            </p>
          </div>

          <div className="mt-16 mx-auto max-w-4xl">
            <div className="lux-card p-8 lg:p-12 bg-midnight text-cream border-gold/40 reveal reveal-delay-1">
              <div className="flex items-baseline justify-between flex-wrap gap-4">
                <div>
                  <span className="eyebrow">The Evening</span>
                  <h3 className="mt-2 font-display text-3xl text-cream">
                    Conclave & Top CHRO Awards Night
                  </h3>
                  <p className="text-sm text-cream/60 mt-1">Hyatt Regency, Chandigarh</p>
                </div>
                <span className="text-gold font-display text-5xl opacity-40">01</span>
              </div>
              <span className="hairline mt-6 block" />
              <ul className="mt-6 divide-y divide-gold/20">
                {programme.map((d) => (
                  <li key={d.t} className="py-4 grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-5 items-start">
                    <span className="text-gold text-xs font-medium tracking-wider pt-0.5 whitespace-nowrap">
                      {d.t}
                    </span>
                    <div>
                      <div className="text-cream font-display text-base leading-snug">{d.title}</div>
                      {d.details.length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                          {d.details.map((line) => (
                            <li key={line} className="text-cream/70 text-[13px] leading-relaxed">
                              {line}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gold/20">
                <p className="text-cream/70 italic font-display text-lg">
                  "A black tie celebration of India's most influential HR leaders."
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* AWARDS */}
      <Section id="awards" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl reveal">
            <span className="eyebrow">Recognition Categories</span>
            <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[1.05]">
              The Top CHRO Awards. India's most credible recognition for HR leadership.
            </h2>
            <span className="gold-divider mt-8" />
            <p className="mt-6 text-midnight/70 text-lg leading-relaxed">
              Winners are selected through a rigorous evaluation process involving a
              jury of industry veterans, academia, and independent evaluators.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((a, i) => (
              <article
                key={a.title}
                className={`reveal reveal-delay-${(i % 4) + 1} lux-card lux-card-hover p-7 relative ${
                  i === 0 ? "md:col-span-2 lg:col-span-3 bg-midnight text-cream border-gold/50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`text-[10px] tracking-[0.22em] uppercase ${
                      i === 0 ? "text-gold" : "text-midnight/50"
                    }`}
                  >
                    {a.sector}
                  </span>
                  <span className={`font-display text-xl ${i === 0 ? "text-gold" : "text-gold/70"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className={`mt-4 font-display ${
                    i === 0 ? "text-3xl lg:text-4xl text-cream" : "text-xl text-midnight"
                  }`}
                >
                  {a.title}
                </h3>
                <span className="hairline my-4 block" />
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-cream/75" : "text-midnight/70"}`}>
                  {a.desc}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-midnight/60 text-sm italic max-w-2xl mx-auto reveal">
            In addition, sector specific special recognitions, emerging CHRO awards,
            and lifetime achievement awards may be conferred based on jury
            recommendations.
          </p>
        </div>
      </Section>

      {/* FEATURED SPEAKERS — COMING SOON */}
      <Section id="speakers" className="bg-midnight text-cream py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,168,76,0.14),transparent_55%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl reveal">
            <span className="eyebrow">Featured Speakers</span>
            <h2 className="mt-5 font-display text-4xl lg:text-6xl leading-[1.05] text-cream">
              A distinguished lineup —{" "}
              <span className="italic text-gold">revealing soon.</span>
            </h2>
            <span className="gold-divider mt-8" />
            <p className="mt-6 text-cream/70 text-lg leading-relaxed">
              Our distinguished lineup of industry leaders will be announced soon.
              Stay tuned for exciting updates.
            </p>
          </div>

          <div className="mt-14 relative reveal mx-auto max-w-4xl">
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 select-none pointer-events-none"
              style={{ filter: "blur(14px)", WebkitFilter: "blur(14px)" }}
              aria-hidden
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gold/25 bg-midnight-deep overflow-hidden"
                >
                  <div
                    className="aspect-[3/4] w-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(201,168,76,0.35), rgba(13,27,62,0.9))",
                    }}
                  />
                  <div className="p-3">
                    <div className="h-2 w-2/3 rounded bg-gold/40" />
                    <div className="mt-2 h-1.5 w-1/2 rounded bg-cream/25" />
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-8 py-10 rounded-2xl border border-gold/40 bg-midnight/70 backdrop-blur-md max-w-lg mx-6">
                <span className="eyebrow">Revealing Soon</span>
                <h3 className="mt-4 font-display text-3xl lg:text-4xl text-cream leading-tight">
                  Speaker Line-up{" "}
                  <span className="italic gold-text">Coming Soon</span>
                </h3>
                <span className="gold-divider mx-auto mt-5" />
                <p className="mt-5 text-cream/75 text-sm leading-relaxed">
                  Our distinguished lineup of industry leaders will be announced
                  soon. Stay tuned for exciting updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* INVITATION */}
      <Section id="invite" className="relative py-24 lg:py-32 bg-cream overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-midnight/10 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="relative rounded-[2rem] overflow-hidden border border-gold/40 bg-gradient-to-br from-midnight via-midnight-deep to-midnight text-cream shadow-[0_40px_120px_-40px_rgba(13,27,62,0.6)]">
            <span className="block h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden />
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(245,240,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,1) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
              aria-hidden
            />

            <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 p-10 sm:p-14 lg:p-20">
              <div className="reveal">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold/50 bg-gold/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-medium">
                    Complimentary Invitation
                  </span>
                </div>
                <h2 className="mt-7 font-display font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-cream">
                  Are You an HR Leader?{" "}
                  <span className="italic gold-text">Join India's Premier</span>{" "}
                  HR Recognition Event.
                </h2>
                <span className="gold-divider mt-8" />
                <p className="mt-7 text-cream/80 text-lg leading-relaxed max-w-2xl font-light">
                  Join India's leading HR professionals for a day of networking,
                  insights, recognition, and meaningful conversations shaping the
                  future of Human Resources.
                </p>
                <p className="mt-5 font-display text-2xl text-gold italic">
                  Attendance is completely FREE for all HR professionals.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link to="/register" className="btn-gold btn-gold-hover gold-glow">
                    Secure Your Delegate Invitation →
                  </Link>
                  <a
                    href="#programme"
                    className="btn-ghost-gold btn-ghost-gold-hover"
                  >
                    View Programme
                  </a>
                </div>
              </div>

              <div className="relative reveal reveal-delay-2 grid content-center">
                <div className="rounded-2xl border border-gold/30 bg-midnight-deep/70 backdrop-blur-sm p-8 lg:p-10">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-gold">
                    What You'll Experience
                  </div>
                  <span className="hairline mt-4 mb-6 block" />
                  <ul className="space-y-5">
                    {[
                      "Curated networking with India's most senior HR voices",
                      "Live recognition of India's Top HR Leaders",
                      "Keynotes on AI, talent, and the future of work",
                      "Black tie gala dinner hosted by Asia INC 500",
                    ].map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        <span className="text-cream/85 text-sm leading-relaxed">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-gold/20 text-center">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold/80">
                      Limited Seats
                    </div>
                    <div className="mt-2 font-display text-cream text-lg">
                      By Invitation Only
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span className="block h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" aria-hidden />
          </div>
        </div>
      </Section>


      {/* DIRECTOR */}
      <Section id="director" className="relative bg-midnight text-cream py-28 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.22),transparent_60%)]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(201,168,76,0.10),transparent_55%)]" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center reveal">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-gold/60" />
              <span className="eyebrow">Direct Enquiries</span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
            <h2 className="mt-7 font-display font-light text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-cream">
              Speak directly{" "}
              <span className="italic gold-text">with us.</span>
            </h2>
            <p className="mt-7 mx-auto max-w-2xl text-cream/70 text-lg leading-relaxed">
              For nominations, sponsorship enquiries, partnership proposals and delegate
              participation, connect with the Asia INC 500 team.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-6 reveal reveal-delay-1">
            {[
              { role: "Events & Strategic Partnerships", name: "Ms. Krishna Bhamini", email: "Bhamini@asiainc500.com", initials: "KB" },
              { role: "Awards & Delegate Coordination", name: "Khushi Godiyal", email: "khushi@asiainc500.com", initials: "KG" },
              { role: "Event Operations & Overall Management", name: "Rishi Krishna", email: "rishi@asiainc500.com", initials: "RK" },
              { role: "Sponsorship", name: "Jayendra Jamadar", email: "jayendra@asiainc500.com", initials: "JJ" },
            ].map((c) => (
              <div
                key={c.email}
                className="relative rounded-2xl border border-gold/30 bg-midnight-deep/70 backdrop-blur-sm overflow-hidden p-8 lg:p-10 transition-all duration-500 hover:border-gold/60 hover:-translate-y-1"
              >
                <span className="block h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent absolute top-0 inset-x-0" aria-hidden />
                <div className="flex items-start gap-5">
                  <div className="shrink-0 h-14 w-14 rounded-full border border-gold/60 grid place-items-center text-gold font-display text-lg tracking-wide">
                    {c.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-gold">
                      {c.role}
                    </div>
                    <div className="mt-2 font-display text-2xl text-cream leading-tight">
                      {c.name}
                    </div>
                    <a
                      href={`mailto:${c.email}`}
                      className="mt-3 inline-block text-cream/80 hover:text-gold text-sm transition-colors break-all"
                    >
                      {c.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center reveal reveal-delay-2">
            <Link
              to="/register"
              className="btn-gold btn-gold-hover gold-glow inline-flex"
            >
              Confirm Your Participation →
            </Link>
          </div>

          <div className="mt-16 text-center reveal reveal-delay-2">
            <div className="text-[10px] tracking-[0.4em] uppercase text-gold/80">
              Asia INC 500
            </div>
            <div className="mt-3 font-display italic text-cream/60 text-base">
              Events & Media Division · India
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-midnight-deep text-cream/70 border-t border-gold/15">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-gold/60 grid place-items-center text-gold font-display text-lg">
                A
              </div>
              <div>
                <div className="font-display text-cream text-lg">Asian HR Conclave</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-gold/80">
                  Top CHRO Awards Night 2026
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed max-w-sm">
              Planned, hosted and executed by Asia INC 500, India's premier
              business media and leadership recognition platform.
            </p>
          </div>

          <div>
            <h4 className="text-gold text-[10px] tracking-[0.25em] uppercase">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.slice(0, 4).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-gold transition-colors">{l.label}</a>
                </li>
              ))}
              <li>
                <Link to="/register" className="hover:text-gold transition-colors">Confirm Your Participation</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-[10px] tracking-[0.25em] uppercase">Programme</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>Reception & Welcome</li>
              <li>Keynote & Panel</li>
              <li>Top CHRO Awards</li>
              <li>Gala Dinner</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-[10px] tracking-[0.25em] uppercase">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>Ms. Krishna Bhamini</li>
              <li>
                <a href="mailto:Bhamini@asiainc500.com" className="hover:text-gold transition-colors">
                  Bhamini@asiainc500.com
                </a>
              </li>
              <li>
                <a href="https://www.asiainc500.com" className="hover:text-gold transition-colors">
                  www.asiainc500.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-[10px] tracking-[0.25em] uppercase">Follow Us</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="https://my.linkedin.com/company/asia-in.-500"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-gold transition-colors"
                >
                  <Linkedin size={16} className="text-gold shrink-0" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/asiainc500/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-gold transition-colors"
                >
                  <Instagram size={16} className="text-gold shrink-0" /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/10">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-cream/50">
            <span>© 2026 Asia INC 500. All rights reserved.</span>
            <span className="tracking-[0.2em] uppercase text-[10px]">
              Confidential · For Authorised Recipients Only
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
