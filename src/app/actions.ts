"use server";

import {
  suggestPurchaseDetails,
  type SuggestPurchaseDetailsOutput,
} from "@/ai/flows/suggest-purchase-details";
import { addDonation } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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
    revalidatePath('/donors');
}
