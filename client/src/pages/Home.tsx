/**
 * Operational Modernism: the page reads like a clear project ledger.
 * Ink, limestone, and Relay Green make a systems consultancy feel precise and human.
 */
import { FormEvent, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Menu,
  MoveRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

const services = [
  {
    number: "01",
    title: "Digital foundations",
    copy: "Websites that turn unclear offers and scattered information into a confident enquiry, decision, or sign-up.",
    detail: "Strategy · information architecture · UX · responsive build",
  },
  {
    number: "02",
    title: "Product & systems",
    copy: "Custom tools, portals, and internal products designed around how people carry a live piece of work forward.",
    detail: "Discovery · product design · dashboards · operations tools",
  },
  {
    number: "03",
    title: "Workflow automation",
    copy: "Connected processes that remove rekeying, reduce manual handoffs, and move the right information at the right moment.",
    detail: "Process maps · integrations · automations · reporting",
  },
];

const stages = [
  ["01", "Find the friction", "We look closely at the decision, handoff, or customer moment that is not working yet."],
  ["02", "Set the system", "We translate the problem into a useful plan, clear scope, and buildable operating model."],
  ["03", "Build & connect", "We design, develop, integrate, and pressure-test the pieces that make the work move."],
  ["04", "Keep improving", "We remain involved where it matters: releases, refinement, and the next important thing."],
];

const navItems = [
  ["Capabilities", "#capabilities"],
  ["Approach", "#approach"],
  ["Partnership", "#partnership"],
];

function RelayGlyph({ className = "" }: { className?: string }) {
  return (
    <span className={`relay-glyph ${className}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast("Consultation brief captured", {
      description: "Connect MathematLab’s preferred inbox or scheduling link before publishing to receive enquiries.",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f1e8] text-[#191b17]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#121510]/92 text-[#f4f1e8] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 lg:px-8">
          <a href="#top" className="group flex items-center gap-3" aria-label="MathematLab home">
            <RelayGlyph className="brand-glyph transition-transform duration-200 group-hover:rotate-[-6deg]" />
            <span className="font-display text-[1.08rem] font-semibold tracking-[-0.05em]">MathematLab</span>
          </a>

          <nav className="hidden items-center gap-7 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#d9d9d0] lg:flex" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <a className="nav-link" href={href} key={label}>
                {label}
              </a>
            ))}
          </nav>

          <a className="hidden btn-lime lg:inline-flex" href="#conversation">
            Start a conversation <ArrowUpRight className="h-4 w-4" />
          </a>

          <button
            className="grid h-10 w-10 place-items-center border border-white/15 text-[#f4f1e8] lg:hidden"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/10 bg-[#121510] px-5 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navItems.map(([label, href]) => (
                <a className="mobile-nav-link" href={href} key={label} onClick={closeMenu}>
                  {label} <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
              <a className="btn-lime mt-4 inline-flex w-fit" href="#conversation" onClick={closeMenu}>
                Start a conversation <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative min-h-[760px] overflow-hidden bg-[#121510] pt-[72px] text-[#f4f1e8] lg:min-h-[860px]">
          <div className="absolute inset-0 opacity-35">
            <div className="hero-grid" />
          </div>
          <div className="absolute bottom-0 right-0 top-[72px] w-full overflow-hidden lg:w-[59%]">
            <div className="hero-architecture" aria-hidden="true">
              <span className="arch-block arch-block--one" />
              <span className="arch-block arch-block--two" />
              <span className="arch-block arch-block--three" />
              <span className="arch-block arch-block--four" />
              <span className="arch-route arch-route--one" />
              <span className="arch-route arch-route--two" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#121510] via-[#121510]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121510]/50 via-transparent to-[#121510]/20" />
          </div>

          <div className="relative mx-auto grid min-h-[688px] max-w-[1600px] grid-cols-1 px-5 pb-10 pt-16 lg:min-h-[788px] lg:grid-cols-[150px_minmax(0,760px)_1fr] lg:px-8 lg:pt-24">
            <aside className="hidden border-r border-white/15 pr-7 lg:flex lg:flex-col lg:justify-between lg:pb-5">
              <div className="side-label text-[#b7eb2d]">New operating model</div>
              <div className="side-label vertical-label text-[#d9d9d0]">Websites / Systems / Automation</div>
            </aside>

            <div className="flex flex-col justify-end pb-10 lg:px-12 lg:pb-20">
              <div className="reveal-up mb-7 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#b7eb2d]">
                <span className="h-px w-10 bg-[#b7eb2d]" />
                Digital systems studio
              </div>
              <h1 className="reveal-up delay-1 max-w-[760px] font-display text-[clamp(3.2rem,7.1vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
                Build the system behind better work.
              </h1>
              <p className="reveal-up delay-2 mt-7 max-w-[540px] font-serif text-[1.28rem] leading-[1.45] text-[#e7e6dc] sm:text-[1.42rem]">
                MathematLab partners with ambitious teams to launch client-facing services, replace costly manual handoffs, and build the websites and systems that make the work move.
              </p>
              <div className="reveal-up delay-3 mt-10 flex flex-wrap items-center gap-3">
                <a className="btn-lime" href="#conversation">
                  Start a conversation <ArrowUpRight className="h-4 w-4" />
                </a>
                <a className="btn-ink" href="#approach">
                  See how we work <ArrowDownRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="hidden items-end justify-end pb-20 lg:flex">
              <div className="max-w-[212px] border-l border-[#b7eb2d] pl-5 text-[0.77rem] leading-relaxed text-[#d5d6ce]">
                <span className="mb-3 block font-semibold uppercase tracking-[0.16em] text-[#b7eb2d]">The shift</span>
                From learning platform to delivery partner: focused on what needs to work next.
              </div>
            </div>
          </div>
          <a className="absolute bottom-5 right-5 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#d9d9d0] lg:bottom-8 lg:right-8" href="#capabilities">
            Scroll to explore <ChevronDown className="h-4 w-4 animate-bounce" />
          </a>
        </section>

        <section className="border-b border-[#191b17]/15 bg-[#f4f1e8]" id="capabilities">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[150px_1fr] lg:px-8">
            <aside className="hidden border-r border-[#191b17]/15 pr-7 pt-12 lg:block">
              <div className="side-label">01 / Capabilities</div>
            </aside>
            <div className="px-5 py-16 lg:px-12 lg:py-24">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.72fr)] lg:items-end">
                <h2 className="font-display text-[clamp(2.5rem,5.5vw,5.5rem)] font-semibold leading-[0.93] tracking-[-0.07em]">
                  A partner for the work your organization is ready to make real.
                </h2>
                <p className="max-w-[440px] font-serif text-[1.22rem] leading-[1.5] text-[#4d5047]">
                  Bring a high-stakes launch, a broken handoff, or a product idea with momentum. We help shape the right thing, then build it with you.
                </p>
              </div>

              <div className="mt-14 grid gap-px bg-[#191b17]/15 md:grid-cols-3">
                {services.map((service, index) => {
                  return (
                    <article className="service-card group bg-[#f4f1e8] p-6 sm:p-8" key={service.number}>
                      <div className="flex items-start justify-between">
                        <span className="font-display text-sm font-semibold tracking-[-0.04em] text-[#5c6055]">{service.number}</span>
                        <RelayGlyph className={`service-relay relay-glyph--variant-${index + 1}`} />
                      </div>
                      <h3 className="mt-16 font-display text-[1.85rem] font-semibold leading-none tracking-[-0.06em]">{service.title}</h3>
                      <p className="mt-5 max-w-[310px] text-[0.95rem] leading-[1.65] text-[#4d5047]">{service.copy}</p>
                      <p className="mt-8 border-t border-[#191b17]/15 pt-4 text-[0.67rem] font-semibold uppercase leading-[1.6] tracking-[0.12em] text-[#5c6055]">{service.detail}</p>
                      <span className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#191b17]">
                        Explore the practice <MoveRight className="h-4 w-4" />
                      </span>
                      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#b7eb2d] transition-transform duration-300 group-hover:scale-x-100" />
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#e7e4da]" id="approach">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[150px_1fr] lg:px-8">
            <aside className="hidden border-r border-[#191b17]/15 pr-7 pt-12 lg:block">
              <div className="side-label">02 / Approach</div>
            </aside>
            <div className="px-5 py-16 lg:px-12 lg:py-24">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.98fr)_minmax(330px,0.62fr)] lg:items-start">
                <div>
                  <div className="section-kicker"><RelayGlyph className="relay-glyph--small" /> The operating sequence</div>
                  <h2 className="mt-7 max-w-[760px] font-display text-[clamp(2.5rem,5.2vw,5.2rem)] font-semibold leading-[0.93] tracking-[-0.07em]">
                    Clear enough to act on. Structured enough to last.
                  </h2>
                </div>
                <div className="lg:mt-10">
                  <p className="max-w-[400px] border-l-2 border-[#b7eb2d] pl-5 font-serif text-[1.2rem] leading-[1.5] text-[#4d5047]">
                    Strong digital work is more than a good-looking interface. It is a shared plan, the right decisions, and a system people can continue to use.
                  </p>
                  <div className="relative mt-8 h-48 overflow-hidden border border-[#191b17]/15 sm:h-56">
                    <div className="workflow-still" aria-hidden="true">
                      <span className="workflow-note workflow-note--one" />
                      <span className="workflow-note workflow-note--two" />
                      <span className="workflow-note workflow-note--three" />
                      <span className="workflow-line workflow-line--one" />
                      <span className="workflow-line workflow-line--two" />
                    </div>
                    <div className="absolute bottom-0 left-0 bg-[#191b17] px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-[#f4f1e8]">Map the real handoff</div>
                  </div>
                </div>
              </div>

              <div className="relative mt-16 border-t border-[#191b17]/20">
                <div className="absolute left-0 top-0 hidden h-1 w-[78%] bg-[#b7eb2d] lg:block" />
                <div className="grid divide-y divide-[#191b17]/20 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
                  {stages.map(([number, title, copy]) => (
                    <article className="relative px-0 py-8 lg:px-6 lg:py-12" key={number}>
                      <span className="font-display text-sm font-semibold text-[#5c6055]">{number}</span>
                      <div className="mt-12 flex h-9 w-9 items-center justify-center border border-[#191b17] bg-[#e7e4da] text-[#191b17]">
                        <RelayGlyph className="relay-glyph--micro" />
                      </div>
                      <h3 className="mt-7 font-display text-[1.7rem] font-semibold leading-none tracking-[-0.055em]">{title}</h3>
                      <p className="mt-4 max-w-[270px] text-[0.91rem] leading-[1.7] text-[#4d5047]">{copy}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#191b17]/15 bg-[#f4f1e8]">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[150px_1.04fr_0.96fr] lg:px-8">
            <aside className="hidden border-r border-[#191b17]/15 pr-7 pt-12 lg:block">
              <div className="side-label">03 / Build</div>
            </aside>
            <div className="flex flex-col justify-between px-5 py-16 lg:border-r lg:border-[#191b17]/15 lg:px-12 lg:py-24">
              <div>
                <div className="section-kicker"><RelayGlyph className="relay-glyph--small" /> Not a template handoff</div>
                <h2 className="mt-7 max-w-[600px] font-display text-[clamp(2.4rem,4.6vw,4.8rem)] font-semibold leading-[0.93] tracking-[-0.07em]">
                  The website your business needs. The system your team can actually run.
                </h2>
              </div>
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <p className="max-w-[270px] text-[0.94rem] leading-[1.7] text-[#4d5047]">
                  We design from the operational reality outward: who needs what, which signal matters, and what should happen next.
                </p>
                <ul className="space-y-3 text-[0.8rem] font-semibold uppercase tracking-[0.11em] text-[#191b17]">
                  {['Decision-led UX', 'Thoughtful integrations', 'Maintainable releases'].map((item) => (
                    <li className="flex items-center gap-3" key={item}><RelayGlyph className="relay-glyph--list" /> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden bg-[#d9d6cb] lg:min-h-0">
              <div className="build-frames" aria-hidden="true">
                <span className="build-frame build-frame--one" />
                <span className="build-frame build-frame--two" />
                <span className="build-frame build-frame--three" />
                <span className="build-route" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#191b17]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-[330px] p-7 text-[#f4f1e8] lg:p-10">
                <p className="font-display text-[1.55rem] font-semibold leading-none tracking-[-0.05em]">Built for the work after launch.</p>
                <p className="mt-4 text-[0.86rem] leading-[1.65] text-[#edede5]">Design, code, documentation, and a clear next iteration—connected from the beginning.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#191b17] text-[#f4f1e8]" id="partnership">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[150px_0.96fr_1.04fr] lg:px-8">
            <aside className="hidden border-r border-white/15 pr-7 pt-12 lg:block">
              <div className="side-label text-[#b7eb2d]">04 / Partnership</div>
            </aside>
            <div className="relative min-h-[430px] overflow-hidden lg:min-h-[640px]">
              <div className="partnership-collage" aria-hidden="true">
                <span className="studio-window studio-window--one" />
                <span className="studio-window studio-window--two" />
                <span className="studio-table" />
                <span className="studio-person studio-person--one" />
                <span className="studio-person studio-person--two" />
                <span className="studio-notes" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#191b17]/90 via-[#191b17]/15 to-transparent" />
              <div className="absolute bottom-7 left-5 right-5 max-w-[310px] lg:bottom-10 lg:left-12">
                <div className="section-kicker text-[#b7eb2d]"><RelayGlyph className="relay-glyph--small" /> Embedded when it matters</div>
                <p className="mt-4 font-serif text-[1.16rem] leading-[1.45] text-[#f4f1e8]">Not an anonymous handoff. A direct working relationship with the people thinking and building alongside you.</p>
              </div>
            </div>
            <div className="flex flex-col justify-between px-5 py-16 lg:px-12 lg:py-24">
              <div>
                <h2 className="max-w-[560px] font-display text-[clamp(2.5rem,4.6vw,5.1rem)] font-semibold leading-[0.92] tracking-[-0.075em]">
                  More than a project. A practical technical partner.
                </h2>
                <p className="mt-7 max-w-[470px] font-serif text-[1.23rem] leading-[1.5] text-[#d2d2c9]">
                  Some work ends at launch. Other work needs a partner who can stay close to the roadmap, sense what is changing, and keep the system useful.
                </p>
              </div>
              <div className="mt-14 border-t border-white/15 pt-6">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#b7eb2d]">Ways to work together</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="border border-white/15 p-4 text-[0.9rem] text-[#e6e6dd]">Defined delivery engagements</div>
                  <div className="border border-white/15 p-4 text-[0.9rem] text-[#e6e6dd]">Ongoing system partnership</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-t border-[#191b17]/15 bg-[#e7e4da] text-[#15170f]" id="conversation">
          <div className="absolute left-0 right-0 top-0 h-1 bg-[#b7eb2d]" />
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[150px_0.9fr_1.1fr] lg:px-8">
            <aside className="hidden border-r border-[#15170f]/20 pr-7 pt-12 lg:block">
              <div className="side-label">05 / Conversation</div>
            </aside>
            <div className="px-5 py-16 lg:px-12 lg:py-24">
              <p className="section-kicker text-[#15170f]"><RelayGlyph className="relay-glyph--small relay-glyph--green" /> Start with the stuck point</p>
              <h2 className="mt-7 max-w-[540px] font-display text-[clamp(2.8rem,5.2vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.075em]">
                Let’s make the next useful thing work.
              </h2>
              <p className="mt-7 max-w-[410px] font-serif text-[1.18rem] leading-[1.5] text-[#4d5047]">
                Tell us what is changing, what is getting in the way, or what your organization is ready to build. We will start from there.
              </p>
            </div>
            <form className="border-t border-[#15170f]/20 px-5 py-12 lg:border-l lg:border-t-0 lg:px-12 lg:py-24" onSubmit={handleSubmit}>
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="form-label">Your name<input className="form-input" required name="name" autoComplete="name" /></label>
                <label className="form-label">Work email<input className="form-input" required type="email" name="email" autoComplete="email" /></label>
              </div>
              <label className="form-label mt-7">Organization<input className="form-input" name="organization" autoComplete="organization" /></label>
              <label className="form-label mt-7">What needs to work better?<textarea className="form-input min-h-[115px] resize-y pt-3" required name="brief" /></label>
              <button className="mt-8 inline-flex items-center gap-3 border border-[#15170f] bg-[#b7eb2d] px-5 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#15170f] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#d2f776] active:scale-[0.98]" type="submit">
                Prepare the consultation brief <ArrowUpRight className="h-4 w-4" />
              </button>
              <p className="mt-5 max-w-[440px] text-xs leading-relaxed text-[#4d5047]">Before publishing, connect this form to MathematLab’s preferred inbox or calendar link so new project enquiries reach the team.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#121510] text-[#d9d9d0]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-8 sm:flex-row sm:items-end sm:justify-between lg:px-8">
            <div>
              <div className="flex items-center gap-3 text-[#f4f1e8]">
              <RelayGlyph className="brand-glyph" />
              <span className="font-display text-lg font-semibold tracking-[-0.05em]">MathematLab</span>
            </div>
            <p className="mt-3 text-sm text-[#aeb0a6]">Digital systems for better work.</p>
          </div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#aeb0a6]">© {new Date().getFullYear()} MathematLab</div>
        </div>
      </footer>
    </div>
  );
}
