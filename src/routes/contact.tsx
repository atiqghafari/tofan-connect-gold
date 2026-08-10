import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteChrome";
import { Phone, MapPin } from "lucide-react";

const TITLE = "Contact Tofan Net — Herat";
const DESC =
  "Call Tofan Net on 0796722464 or visit us in Herat, Telecommunications Road, Ferdowsi 4.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        lead="Talk to our team about coverage in your area, installation or a business connection."
      />
      <section className="mx-auto max-w-4xl px-5 pb-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <a href="tel:0796722464" className="card-lux block rounded-md p-8">
            <Phone className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xs uppercase tracking-[0.24em] text-muted-foreground">Phone</h2>
            <p className="mt-2 font-display text-2xl text-gold">0796722464</p>
          </a>
          <div className="card-lux rounded-md p-8">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="mt-5 text-xs uppercase tracking-[0.24em] text-muted-foreground">Office</h2>
            <p className="mt-2 text-sm uppercase leading-relaxed tracking-[0.14em]">
              Herat
              <br />
              Telecommunications Road
              <br />
              Ferdowsi 4
            </p>
          </div>
        </div>
      </section>
    </>
  );
}