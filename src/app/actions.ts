"use server";

import {
  suggestPurchaseDetails,
  type SuggestPurchaseDetailsOutput,
} from "@/ai/flows/suggest-purchase-details";
import { addDonation, getDonorUser, updateDonationReport } from "@/lib/data";
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

export async function createDonation(formData: FormData) {
  const donor = getDonorUser();

  const data = {
    amount: Number(formData.get('amount')),
    purpose: formData.get('purpose') as string,
    recipientId: formData.get('recipientId') as string,
    newRecipientName: formData.get('newRecipientName') as string,
  };

  if (!data.amount || data.amount <= 0 || !data.purpose || (!data.recipientId && !data.newRecipientName)) {
    // Basic server-side validation
    // A more robust solution would return error messages to the client
    throw new Error("Invalid donation data provided.");
  }

  addDonation({
    donorId: donor.id,
    amount: data.amount,
    purpose: data.purpose,
    recipientId: data.recipientId,
    newRecipientName: data.newRecipientName,
  });

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

  const updated = updateDonationReport(validatedData.donationId, validatedData.usageDetails);
  
  if (!updated) {
    throw new Error("Donation not found");
  }

  revalidatePath("/recipients");
  revalidatePath(`/recipients/donations/${validatedData.donationId}`);
  revalidatePath("/donors");
  revalidatePath(`/donors/donations/${validatedData.donationId}`);
  redirect("/recipients");
}
