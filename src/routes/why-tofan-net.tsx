import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteChrome";
import { Globe2, ShieldCheck, Users, Clock } from "lucide-react";

const TITLE = "Why Tofan Net — Reliable Wireless Internet";
const DESC =
  "Wide coverage, reliable connectivity, local representatives and 24/7 support — the reasons Herat chooses Tofan Net.";

export const Route = createFileRoute("/why-tofan-net")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: WhyPage,
});

const reasons = [
  { icon: Globe2, title: "Wide Coverage", text: "From the centre of Herat to distant villages, our towers keep extending the reach of the network." },
  { icon: ShieldCheck, title: "Reliable Connectivity", text: "Engineered links, monitored equipment and redundant paths keep the signal steady." },
  { icon: Users, title: "Local Representatives", text: "Real people in your own area handle installation, payment and service — not a distant call centre." },
  { icon: Clock, title: "24/7 Support", text: "Our technical team answers day and night, because connectivity does not keep office hours." },
];

function WhyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our promise"
        title="Why Tofan Net"
        lead="Four commitments that define how we build and how we serve."
      />
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {reasons.map((r) => (
            <article key={r.title} className="card-lux flex gap-5 rounded-md p-7">
              <r.icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div className="min-w-0">
                <h2 className="text-sm uppercase tracking-[0.18em] text-gold">{r.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}