"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HelpCircle, Mail } from "lucide-react";

export default function SupportPage() {
  const [faqOpen, setFaqOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-100 space-y-6">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl bg-white text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Support</CardTitle>
          <CardDescription className="text-gray-500">
            Need help? Check our FAQ or contact us directly.
          </CardDescription>
        </CardHeader>
        <Separator className="my-4" />
        <div className="flex justify-around">
          <Button variant="ghost" onClick={() => setFaqOpen(true)}>
            <HelpCircle className="w-10 h-10 text-gray-600" />
          </Button>
          <Button variant="ghost" onClick={() => setContactOpen(true)}>
            <Mail className="w-10 h-10 text-gray-600" />
          </Button>
        </div>
      </Card>
      
      <Dialog open={faqOpen} onOpenChange={setFaqOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Frequently Asked Questions</DialogTitle>
            <DialogDescription>
              <ul className="list-disc pl-5 space-y-2">
                <li>How can I reset my password?</li>
                <li>Where can I update my account information?</li>
                <li>How do I contact customer support?</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              <p>Email: support@example.com</p>
              <p>Phone: +1 234 567 890</p>
              <p>Live Chat: Available 9 AM - 6 PM</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
