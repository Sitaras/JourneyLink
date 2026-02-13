import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Typography from "@/components/ui/typography";
import { Trans } from "@lingui/react/macro";

export default function FaqSection() {
  return (
    <section className="w-full space-y-6">
      <Typography variant="h2" className="text-2xl font-bold">
        <Trans>Frequently Asked Questions</Trans>
      </Typography>

      <div className="grid gap-4 w-full max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <Trans>How do I book a ride?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Simply search for your destination, choose a ride that suits
                your schedule, and click &quot;Book&quot;. You can contact the
                driver if you have specific questions before booking.
              </Trans>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <Trans>Is it safe to travel with strangers?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Safety is our priority. All drivers are verified, and you can
                read reviews from other passengers before booking. We monitor
                all activity to ensure a secure community.
              </Trans>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <Trans>Can I cancel my booking?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Yes, you can cancel your booking through your &quot;My
                Rides&quot; page. Cancellation policies may vary depending on
                how close to the departure time you cancel.
              </Trans>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <Trans>How do I pay for the ride?</Trans>
            </AccordionTrigger>
            <AccordionContent>
              <Trans>
                Payment is handled securely through the platform or in cash
                directly to the driver, depending on the ride settings. Check
                the ride details for specific payment information.
              </Trans>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
