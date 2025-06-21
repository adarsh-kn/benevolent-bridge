"use server";

import {
  suggestPurchaseDetails,
  type SuggestPurchaseDetailsOutput,
} from "@/ai/flows/suggest-purchase-details";
import { addDonation, mockDonations } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

const SuggestionInputSchema = z.string().min(10);

export async function getPurchaseSuggestion(
  donationDescription: string
): Promise<SuggestPurchaseDetailsOutput> {
  const validatedDescription = SuggestionInputSchema.parse(donationDescription);

  try {
    const result = await suggestPurchaseDetails({
      donationDescription: validatedDescription,
    });
    return result;
  } catch (error) {
    console.error("Error in suggestPurchaseDetails flow:", error);
    return {
      suggestedDetails:
        "We could not generate a suggestion at this time. Please write the details manually.",
    };
  }
}

export async function createDonation(donationData: {
  donorId: string;
  recipientId: string;
  amount: number;
  purpose: string;
  newRecipientName?: string;
}) {
  addDonation(donationData);
  revalidatePath("/donors");
  redirect("/donors");
}

const ReportSchema = z.object({
  donationId: z.string(),
  usageDetails: z
    .string()
    .min(20, { message: "Usage details must be at least 20 characters." })
    .max(500, {
      message: "Usage details must not be longer than 500 characters.",
    }),
});

export async function submitUsageReport(data: {
  donationId: string;
  usageDetails: string;
}) {
  const validatedData = ReportSchema.parse(data);

  const donationIndex = mockDonations.findIndex(
    (d) => d.id === validatedData.donationId
  );
  if (donationIndex !== -1) {
    mockDonations[donationIndex].usageDetails = validatedData.usageDetails;
    mockDonations[donationIndex].status = "Reported";
  } else {
    throw new Error("Donation not found");
  }

  revalidatePath("/recipients");
  revalidatePath(`/recipients/donations/${validatedData.donationId}`);
  revalidatePath("/donors");
  revalidatePath(`/donors/donations/${validatedData.donationId}`);
  redirect("/recipients");
}
