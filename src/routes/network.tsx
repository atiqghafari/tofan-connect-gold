import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteChrome";
import { StormNetwork } from "@/components/StormNetwork";

const TITLE = "Our Network — Tofan Net Coverage in Herat";
const DESC =
  "Tofan Net covers Herat city, surrounding districts and remote villages with a wireless tower network and local representatives.";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: NetworkPage,
});

const layers = [
  {
    label: "Herat City",
    text: "A dense core of distribution points covering residential zones, markets and business districts with high-capacity backhaul.",
  },
  {
    label: "Districts",
    text: "Relay towers extend the backbone outward, carrying the same quality of service to district centres around the province.",
  },
  {
    label: "Villages",
    text: "Last-mile links reach remote villages where cable never arrived — installed and maintained by local representatives.",
  },
];

function NetworkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Coverage"
        title="Our Network"
        lead="Our wireless backbone starts in Herat city and reaches outward through districts and villages — a connected chain of towers, relays and local teams."
      />
      <section className="relative mx-auto max-w-6xl overflow-hidden px-5">
        <div className="card-lux relative overflow-hidden rounded-3xl">
          <StormNetwork density={1.2} className="h-60 w-full sm:h-80" />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">
              One backbone · Many communities
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {layers.map((l, i) => (
            <article key={l.label} className="card-lux rounded-3xl p-7">
              <span className="font-display text-3xl text-gold">0{i + 1}</span>
              <h2 className="mt-4 text-sm uppercase tracking-[0.2em]">{l.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}