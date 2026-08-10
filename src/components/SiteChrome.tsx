import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/network", label: "Our Network" },
  { to: "/why-tofan-net", label: "Why Tofan Net" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:flex md:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/50">
            <span className="h-3 w-3 rounded-full bg-primary" />
          </span>
          <span className="truncate font-display text-lg tracking-[0.25em] text-gold">
            TOFAN NET
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="text-xs uppercase tracking-[0.18em] transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          className="justify-self-end text-primary md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 pb-5 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="py-3 text-sm uppercase tracking-[0.18em] text-muted-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-base tracking-[0.25em] text-gold">TOFAN NET</p>
          <p className="mt-3 text-sm text-muted-foreground">Connect beyond limits.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Herat</p>
          <p>Telecommunications Road</p>
          <p>Ferdowsi 4</p>
        </div>
        <div className="sm:text-right">
          <a
            href="tel:0796722464"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Phone className="h-4 w-4" /> 0796722464
          </a>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            © {new Date().getFullYear()} Tofan Net
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 text-center sm:pt-24">
      <p className="text-xs uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
      <h1 className="mt-4 text-3xl uppercase sm:text-5xl">
        <span className="text-gold">{title}</span>
      </h1>
      <div className="rule-gold mx-auto mt-6 w-40" />
      <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {lead}
      </p>
    </section>
  );
}