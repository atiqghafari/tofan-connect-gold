import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { Radio, Share2, Wifi, Building2, Plus, Minus, Check } from "lucide-react";

const TITLE = "Services — Tofan Net";
const DESC =
  "Point to point, point to multi-point, home internet and business connectivity delivered by Tofan Net in Herat.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Services,
});

type Service = {
  icon: typeof Radio;
  title: string;
  short: string;
  detail: string;
  features: string[];
};

const services: Service[] = [
  {
    icon: Radio,
    title: "Point to Point",
    short: "Dedicated wireless bridge between two fixed sites.",
    detail:
      "Engineered for maximum throughput and minimum latency — ideal for branch offices, towers and remote facilities that need a private, high-capacity link.",
    features: [
      "Dedicated bandwidth, no sharing",
      "Low-latency private link",
      "Up to several km range",
      "SLA-backed uptime",
    ],
  },
  {
    icon: Share2,
    title: "Point to Multi-Point",
    short: "One tower serving many subscribers at once.",
    detail:
      "A single distribution tower brings fast internet to whole neighbourhoods, districts and villages simultaneously — the backbone of community-scale coverage.",
    features: [
      "Scales to many users",
      "Neighbourhood & village coverage",
      "Shared high-capacity tower",
      "Quick subscriber onboarding",
    ],
  },
  {
    icon: Wifi,
    title: "Home Internet",
    short: "Affordable, stable connectivity for families.",
    detail:
      "Streaming, study and daily communication without interruption — dependable wireless internet delivered straight to the home across Herat.",
    features: [
      "Stable daily connection",
      "Streaming & video calls",
      "Affordable household plans",
      "Easy self-setup",
    ],
  },
  {
    icon: Building2,
    title: "Business Connectivity",
    short: "Priority bandwidth and direct support for companies.",
    detail:
      "Priority bandwidth, guaranteed uptime and direct technical support for companies, institutions and organisations that cannot afford downtime.",
    features: [
      "Priority guaranteed bandwidth",
      "Dedicated technical support",
      "Business-grade uptime SLA",
      "Scalable to multiple sites",
    ],
  },
];

function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const Icon = service.icon;

  return (
    <article
      className={`card-lux rounded-3xl p-8 flex flex-col transition-all duration-300 ${
        open ? "border-primary/70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold-1/40 bg-gradient-to-br from-gold-1/15 to-transparent">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <span className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          0{services.indexOf(service) + 1}
        </span>
      </div>

      <h2 className="mt-6 text-lg uppercase tracking-[0.16em] text-gold">
        {service.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {service.short}
      </p>

      <div
        className={`grid transition-all duration-400 ease-out ${
          open
            ? "grid-rows-[1fr] opacity-100 mt-5"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {service.detail}
          </p>
          <ul className="mt-5 space-y-2.5">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-foreground/90">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn-royal mt-6 inline-flex items-center justify-center gap-2 self-start rounded-2xl px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em]"
      >
        {open ? (
          <>
            <Minus className="h-3.5 w-3.5" /> Less details
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" /> View details
          </>
        )}
      </button>
    </article>
  );
}

function Services() {
  return (
    <>
      <PageHeader
        eyebrow="What we deliver"
        title="Services"
        lead="Wireless infrastructure built for the terrain of Herat — from a single household to an entire enterprise network."
      />
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </section>
    </>
  );
}
