import { createFileRoute, Link } from "@tanstack/react-router";
import { StormNetwork } from "@/components/StormNetwork";
import { Radio, Share2, Wifi, Building2 } from "lucide-react";
import { StormVideo } from "@/components/StormVideo";

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
  { icon: Radio, title: "Point to Point", text: "A private, high-capacity wireless bridge linking two fixed locations with dedicated bandwidth." },
  { icon: Share2, title: "Point to Multi-Point", text: "One distribution tower serving entire neighbourhoods, districts and villages at once." },
  { icon: Wifi, title: "Home Internet", text: "Stable, affordable wireless internet delivered straight to every home across Herat." },
  { icon: Building2, title: "Business Connectivity", text: "Priority bandwidth, guaranteed uptime and direct support for companies and institutions." },
];

function Index() {
  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        <StormVideo className="pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/35 via-transparent to-background" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.42_0.06_74_/_45%)] via-[oklch(0.30_0.04_72_/_22%)] to-transparent mix-blend-soft-light" />
        <StormNetwork className="pointer-events-none absolute inset-0 h-full w-full opacity-60 mix-blend-screen" />
        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-primary sm:text-xs">
            Herat · Afghanistan
          </p>
          <h1 className="mt-6 text-6xl font-semibold leading-[0.95] tracking-tight sm:text-9xl">
            <span className="text-gold">Tofan</span>
            <span className="text-foreground/90"> Net</span>
          </h1>
          <div className="rule-gold mt-6 w-56 max-w-full" />
          <p className="mt-6 text-base font-light tracking-[0.18em] text-muted-foreground sm:text-2xl">
            Connect beyond limits.
          </p>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground/80 sm:text-lg">
            Wireless that cuts through the storm — engineered for Herat's
            terrain, from the city core to the farthest village.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/services"
              className="btn-royal rounded-2xl px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Explore services
            </Link>
            <Link
              to="/contact"
              className="rounded-2xl border border-primary/50 px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10"
            >
              Get connected
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="card-lux rounded-2xl p-6">
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
