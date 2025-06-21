import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDonationsByDonor, getDonorUser } from "@/lib/data";
import { ArrowRight, HandHeart } from "lucide-react";

export default function DonorDashboard() {
  const user = getDonorUser();
  const donations = getDonationsByDonor(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's a summary of your generous contributions.</p>
        </div>
        <Link href="/donors/new-donation" passHref>
          <Button size="lg">
            <HandHeart className="mr-2" />
            Make a New Donation
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>A record of all donations you have made.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.recipientName}</TableCell>
                  <TableCell className="text-right">₹{donation.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={donation.status === 'Reported' ? 'default' : 'secondary'} className={donation.status === 'Reported' ? 'bg-accent text-accent-foreground' : ''}>
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Link href={`/donors/donations/${donation.id}`} passHref>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
