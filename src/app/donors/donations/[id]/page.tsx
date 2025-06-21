import { getDonationById } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, DollarSign, Edit, User, Info } from "lucide-react";

export default function DonorDonationDetailsPage({ params }: { params: { id: string } }) {
  const donation = getDonationById(params.id);

  if (!donation) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Donation Details</h1>
        <p className="text-muted-foreground">Viewing details for donation ID: {donation.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Summary</CardTitle>
          <CardDescription>
            A donation made to <strong>{donation.recipientName}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-semibold text-lg">${donation.amount.toFixed(2)}</p>
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
                <p className="text-muted-foreground">Recipient</p>
                <p className="font-semibold">{donation.recipientName}</p>
              </div>
            </div>
          </div>
          <Separator />
           <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2"><Info className="w-4 h-4"/> Intended Purpose</h4>
            <p className="text-muted-foreground p-4 border bg-background rounded-md">{donation.purpose}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Usage Report</CardTitle>
              <CardDescription>How the recipient used your donation.</CardDescription>
            </div>
            <Badge variant={donation.status === 'Reported' ? 'default' : 'secondary'} className={donation.status === 'Reported' ? 'bg-accent text-accent-foreground' : ''}>
              {donation.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {donation.status === "Reported" && donation.usageDetails ? (
            <div className="p-4 border-l-4 border-accent bg-accent/20 rounded-r-md">
              <p className="text-accent-foreground/90">{donation.usageDetails}</p>
            </div>
          ) : (
            <Alert>
              <Edit className="h-4 w-4" />
              <AlertTitle>Report Pending</AlertTitle>
              <AlertDescription>
                The recipient has not yet reported how these funds were used. We will notify you when the report is submitted.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
