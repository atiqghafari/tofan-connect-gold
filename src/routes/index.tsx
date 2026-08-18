import { createFileRoute, Link } from "@tanstack/react-router";
import { Radio, Share2, Wifi, Building2, ChevronDown } from "lucide-react";
import heroStorm from "@/assets/hero-storm.jpg.asset.json";

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
      <section className="relative isolate overflow-hidden border-b border-primary/30">
        <img
          src={heroStorm.url}
          alt="Supercell storm with tornado over the lights of Herat at sunset"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/55 via-background/20 to-background/70" />

        <div className="mx-auto flex min-h-[86vh] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.45em] text-primary sm:text-sm">
            Herat &nbsp;·&nbsp; Afghanistan
          </p>
          <div className="diamond-rule mt-5 w-48 max-w-full" />
          <h1 className="mt-4 font-display text-5xl uppercase leading-[1] tracking-[0.04em] sm:text-8xl">
            <span className="text-gold">Tofan</span>{" "}
            <span className="text-foreground">Net</span>
          </h1>
          <p className="mt-5 font-display text-lg uppercase tracking-[0.35em] text-foreground sm:text-3xl">
            Connect Beyond Limits.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Wireless connectivity engineered for Herat's terrain — from the city
            core to the farthest village.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/services"
              className="btn-royal clip-bevel px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Explore services
            </Link>
            <Link
              to="/contact"
              className="clip-bevel border border-primary/60 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10"
            >
              Get connected
            </Link>
          </div>
          <div className="mt-14 flex flex-col items-center gap-1 text-primary/80">
            <span className="flex h-9 w-5 items-start justify-center rounded-full border border-primary/60 p-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Our Services</p>
          <h2 className="mt-3 font-display text-2xl uppercase tracking-[0.06em] text-foreground sm:text-4xl">
            Connectivity Without Limits
          </h2>
          <div className="diamond-rule mx-auto mt-5 w-56 max-w-full" />
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="card-lux clip-bevel p-7 text-center">
              <h.icon className="mx-auto h-9 w-9 text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-sm uppercase tracking-[0.18em] text-primary">
                {h.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
