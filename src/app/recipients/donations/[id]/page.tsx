import { getDonationById } from "@/lib/data";
import { notFound } from "next/navigation";
import { DonationReportForm } from "@/components/recipients/donation-report-form";

export default function RecipientDonationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const donation = getDonationById(params.id);

  if (!donation) {
    notFound();
  }

  return <DonationReportForm donation={donation} />;
}
