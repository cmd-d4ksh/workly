import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is Workly free for teams looking for space?",
    a: "Yes. Submitting your requirements and getting matched with spaces is always free for workspace seekers.",
  },
  {
    q: "How does the matching engine work?",
    a: "It's a transparent, rules-based scoring system — not a black-box AI claim. We weight location, workspace type, budget, capacity, amenities, and availability to produce a 0–100 match score for every relevant space.",
  },
  {
    q: "Can I negotiate pricing directly with the space?",
    a: "Yes. Workly connects you directly with the operator — pricing, terms, and move-in details are negotiated between you and them.",
  },
  {
    q: "How do operators get listed?",
    a: "Operators create an account, list their space with pricing and amenities, and submit it for review. Once approved, the space appears in search and starts receiving matched leads.",
  },
  {
    q: "What happens after I submit a request?",
    a: "We immediately calculate match scores against all eligible spaces and show you your top matches. Operators behind your best matches are notified so they can reach out.",
  },
];

export function Faq() {
  return (
    <section className="page-shell py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center font-heading text-3xl font-medium tracking-tight">
          Frequently asked questions
        </h2>
        <Accordion className="mt-8">
          {FAQS.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
