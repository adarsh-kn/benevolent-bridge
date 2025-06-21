"use client";

import { useState, useEffect } from "react";
import type { Donation } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getPurchaseSuggestion, submitUsageReport } from "@/app/actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar, Wallet, Info, Sparkles, User } from "lucide-react";

const formSchema = z.object({
  usageDetails: z.string().min(20, {
    message: "Usage details must be at least 20 characters.",
  }).max(500, {
    message: "Usage details must not be longer than 500 characters."
  }),
});

export function DonationReportForm({ donation }: { donation: Donation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usageDetails: donation?.usageDetails || "",
    },
  });

  useEffect(() => {
     if (donation) {
        form.reset({ usageDetails: donation.usageDetails || "" });
     }
  }, [donation, form]);

  const handleSuggest = async () => {
    setIsLoading(true);
    try {
      const result = await getPurchaseSuggestion(donation.purpose);
      if (result && result.suggestedDetails) {
        form.setValue("usageDetails", result.suggestedDetails, { shouldValidate: true });
        toast({
          title: "Suggestion generated!",
          description: "The AI has provided a suggestion for your report.",
        });
      } else {
        throw new Error("AI did not return a suggestion.");
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate a suggestion at this time.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await submitUsageReport({
        donationId: donation.id,
        usageDetails: values.usageDetails,
      });

      toast({
        title: "Report Submitted!",
        description: "Thank you for your transparency. The donor has been notified.",
      });
    } catch (error) {
      console.error("Report submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not submit the report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">Donation Details</h1>
        <p className="text-muted-foreground">From {donation.donorName} for Rs. {donation.amount.toFixed(2)}</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Donation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
             <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
              <Wallet className="w-5 h-5 text-primary" />
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">Rs. {donation.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-semibold">{new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-muted-foreground">Donor</p>
                <p className="font-semibold">{donation.donorName}</p>
              </div>
            </div>
          </div>
           <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2"><Info className="w-4 h-4"/> Donor's Intended Purpose</h4>
            <p className="text-muted-foreground p-4 border bg-background rounded-md">{donation.purpose}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Donation Usage</CardTitle>
          <CardDescription>
            {donation.status === "Pending"
              ? "Please detail how the funds were used. This report will be shared with the donor."
              : "You have already reported on this donation. You can view or edit your report below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="usageDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase & Usage Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Purchased 50 textbooks for 5th-grade students, provided 100 meals at the community kitchen..."
                        className="min-h-[120px]"
                        {...field}
                        disabled={(donation.status === 'Reported' && !isLoading) || isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Be as specific as possible. Your transparency builds trust.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSuggest}
                    disabled={isLoading || isSubmitting}
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isLoading ? "Generating..." : "Suggest Details with AI"}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : (donation.status === 'Reported' ? 'Update Report' : 'Submit Report')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
