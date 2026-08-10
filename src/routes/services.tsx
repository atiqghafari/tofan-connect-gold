import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteChrome";
import { Radio, Share2, Wifi, Building2 } from "lucide-react";

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

const services = [
  {
    icon: Radio,
    title: "Point to Point",
    text: "A dedicated wireless bridge between two fixed sites, engineered for maximum throughput and minimum latency — ideal for branch offices, towers and remote facilities.",
  },
  {
    icon: Share2,
    title: "Point to Multi-Point",
    text: "A single distribution tower serving many subscribers at once, bringing fast internet to whole neighbourhoods, districts and villages at once.",
  },
  {
    icon: Wifi,
    title: "Home Internet",
    text: "Affordable, stable connectivity for families — streaming, study and daily communication without interruption.",
  },
  {
    icon: Building2,
    title: "Business Connectivity",
    text: "Priority bandwidth, guaranteed uptime and direct technical support for companies, institutions and organisations.",
  },
];

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
            <article key={s.title} className="card-lux rounded-md p-8">
              <s.icon className="h-7 w-7 text-primary" />
              <h2 className="mt-6 text-lg uppercase tracking-[0.16em] text-gold">{s.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}