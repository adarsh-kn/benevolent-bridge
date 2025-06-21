import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDonationsByRecipient, getRecipientUser } from "@/lib/data";
import { ArrowRight, Calendar, IndianRupee, Edit, UserCheck } from "lucide-react";

export default function RecipientDashboard() {
  const user = getRecipientUser();
  const donations = getDonationsByRecipient(user.id);

  const totalReceived = donations.reduce((sum, d) => sum + d.amount, 0);
  const pendingReports = donations.filter(d => d.status === 'Pending').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {user.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here are the donations you've received.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalReceived.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">from {donations.length} donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">Donations awaiting usage reports</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Received Donations</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {donations.map((donation) => (
            <Card key={donation.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">₹{donation.amount.toFixed(2)}</CardTitle>
                    <CardDescription>From <strong>{donation.donorName}</strong></CardDescription>
                  </div>
                  <Badge variant={donation.status === 'Reported' ? 'default' : 'secondary'} className={donation.status === 'Reported' ? 'bg-accent text-accent-foreground' : ''}>
                    {donation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(donation.date).toLocaleDateString()}</span>
                  </div>
                   <p className="text-sm text-muted-foreground line-clamp-2">{donation.purpose}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/recipients/donations/${donation.id}`} passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    {donation.status === 'Pending' ? 'Report Usage' : 'View Details'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
