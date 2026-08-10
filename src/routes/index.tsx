import { createFileRoute, Link } from "@tanstack/react-router";
import { StormNetwork } from "@/components/StormNetwork";
import { Radio, Share2, Wifi, Building2 } from "lucide-react";

const TITLE = "Tofan Net — Wireless Internet in Herat";
const DESC =
  "Tofan Net delivers point-to-point, point-to-multi-point, home and business wireless internet across Herat city, districts and villages.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

const highlights = [
  { icon: Radio, title: "Point to Point", text: "Dedicated high-capacity links between two fixed locations." },
  { icon: Share2, title: "Point to Multi-Point", text: "One tower, many subscribers — efficient district coverage." },
  { icon: Wifi, title: "Home Internet", text: "Stable everyday connectivity for families across Herat." },
  { icon: Building2, title: "Business Connectivity", text: "Priority bandwidth and uptime for offices and enterprises." },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StormNetwork className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-primary sm:text-xs">
            Herat · Afghanistan
          </p>
          <h1 className="mt-6 text-4xl uppercase leading-tight sm:text-7xl">
            <span className="text-gold">Tofan Net</span>
          </h1>
          <div className="rule-gold mt-6 w-56 max-w-full" />
          <p className="mt-6 text-sm uppercase tracking-[0.32em] text-muted-foreground sm:text-lg">
            Connect Beyond Limits
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/services"
              className="btn-royal rounded-sm px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Our Services
            </Link>
            <Link
              to="/contact"
              className="rounded-sm border border-primary/50 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10"
            >
              Get Connected
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="card-lux rounded-md p-6">
              <h.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-5 text-sm uppercase tracking-[0.18em] text-foreground">{h.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
