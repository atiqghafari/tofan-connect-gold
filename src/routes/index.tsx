import { createFileRoute, Link } from "@tanstack/react-router";
import { Radio, Share2, Wifi, Building2 } from "lucide-react";
import supercell from "@/assets/supercell.png.asset.json";

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
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 aspect-[697/429] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2">
            <img
              src={supercell.url}
              alt="Supercell storm over open plains at sunset"
              className="absolute inset-0 h-full w-full scale-[1.06] object-fill brightness-110 contrast-115 saturate-110"
            />
            {/* only the mesocyclone / funnel area rotates */}
            <div className="storm-swirl-mask absolute inset-0">
              <img
                src={supercell.url}
                alt=""
                aria-hidden
                className="storm-swirl absolute inset-0 h-full w-full object-fill brightness-110 contrast-115 saturate-110"
              />
            </div>
            <div className="storm-swirl-inner-mask absolute inset-0">
              <img
                src={supercell.url}
                alt=""
                aria-hidden
                className="storm-swirl-inner absolute inset-0 h-full w-full object-fill brightness-110 contrast-115 saturate-110"
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/35 via-transparent to-background/35" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/10" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_55%,transparent_0%,oklch(0.1_0.01_70/20%)_80%)]" />
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
