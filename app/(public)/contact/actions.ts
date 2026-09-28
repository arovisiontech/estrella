"use server";

import { createClient } from "@/lib/supabase/server";
import { validateContactForm } from "@/lib/validation/contact";
import { ContactFormData, SubmitResult } from "@/lib/types/contact";

const SPAM_SUBMISSION_COOLDOWN = 3000; // 3 seconds
const MIN_SUBMISSION_TIME = 1000; // 1 second
const submissionTimes = new Map<string, number>();

function getClientIdentifier(ip?: string): string {
  return ip || "unknown";
}

function checkSpamProtection(identifier: string): boolean {
  const lastSubmission = submissionTimes.get(identifier);
  if (!lastSubmission) return false;

  const timeSinceLastSubmission = Date.now() - lastSubmission;
  return timeSinceLastSubmission < SPAM_SUBMISSION_COOLDOWN;
}

function recordSubmission(identifier: string): void {
  submissionTimes.set(identifier, Date.now());

  if (submissionTimes.size > 100) {
    const cutoff = Date.now() - 60000;
    for (const [key, time] of submissionTimes.entries()) {
      if (time < cutoff) {
        submissionTimes.delete(key);
      }
    }
  }
}

export async function submitContactForm(
  data: Partial<ContactFormData>,
  clientTimestamp: number,
  honeypot?: string
): Promise<SubmitResult> {
  try {
    // Honeypot field check
    if (honeypot && honeypot.trim() !== "") {
      return {
        success: false,
        message: "Form submission failed. Please try again.",
      };
    }

    // Check minimum submission time
    const submissionDuration = Date.now() - clientTimestamp;
    if (submissionDuration < MIN_SUBMISSION_TIME) {
      return {
        success: false,
        message: "Please take more time to fill out the form.",
      };
    }

    // Validate form data
    const errors = validateContactForm(data);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors below and try again.",
        errors,
      };
    }

    // Check spam protection
    const clientIdentifier = getClientIdentifier();
    if (checkSpamProtection(clientIdentifier)) {
      return {
        success: false,
        message: "Please wait before submitting another form. Try again in a few seconds.",
      };
    }

    const supabase = await createClient();

    const insertPayload: Record<string, any> = {
      full_name: data.full_name?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim() || null,
      company_name: data.company_name?.trim() || null,
      country: data.country?.trim() || null,
      subject: data.subject?.trim() || "Website Contact Inquiry",
      message: data.message?.trim(),
      status: "new",
    };

    const { error } = await supabase
      .from("contact_inquiries")
      .insert([insertPayload]);

    if (error) {
      console.error("Supabase contact inquiry insert error:", error);
      return {
        success: false,
        message: "Failed to submit inquiry: " + error.message,
      };
    }

    recordSubmission(clientIdentifier);

    return {
      success: true,
      message:
        "Thank you for your inquiry. Our team will review your requirements and contact you shortly.",
    };
  } catch (error: any) {
    console.error("Form submission error:", error);
    return {
      success: false,
      message: error?.message || "An unexpected error occurred. Please try again later.",
    };
  }
}
