"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withAdmin, adminUpdate, adminDelete, type ActionResult } from "./guard";

export interface ContactInquiryInput {
  full_name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  country?: string | null;
  subject?: string | null;
  message: string;
  product_id?: string | null;
  honeypot?: string; // spam protection field
}

export async function submitContactInquiry(input: ContactInquiryInput): Promise<ActionResult> {
  // Spam check: if honeypot is populated, reject silently or gracefully
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { success: true, message: "Thank you for your message. We will get back to you shortly." };
  }

  if (!input.full_name?.trim()) {
    return { success: false, message: "Please provide your full name." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email?.trim() || !emailRegex.test(input.email.trim())) {
    return { success: false, message: "Please provide a valid email address." };
  }

  if (!input.message?.trim() || input.message.trim().length < 5) {
    return { success: false, message: "Please enter a message (at least 5 characters)." };
  }

  const cleaned = {
    full_name: input.full_name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    company_name: input.company_name?.trim() || null,
    country: input.country?.trim() || null,
    subject: input.subject?.trim() || null,
    message: input.message.trim(),
    product_id: input.product_id || null,
    status: "new",
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_inquiries").insert([cleaned]);

    if (error) {
      console.error("Error submitting contact inquiry:", error);
      return { success: false, message: `Submission failed: ${error.message}` };
    }

    revalidatePath("/admin/inquiries");
    return { success: true, message: "Thank you! Your message has been sent successfully. Our team will contact you shortly." };
  } catch (err) {
    console.error("Unexpected error submitting inquiry:", err);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

export async function updateInquiryStatus(id: string, status: string): Promise<ActionResult> {
  const allowed = ["new", "contacted", "closed"];
  if (!allowed.includes(status)) {
    return { success: false, message: `Invalid status '${status}'. Allowed: ${allowed.join(", ")}` };
  }

  const result = await adminUpdate("contact_inquiries", id, { status }, "Inquiry");
  if (result.success) revalidatePath("/admin/inquiries");
  return result;
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  const result = await adminDelete("contact_inquiries", id, "Inquiry");
  if (result.success) revalidatePath("/admin/inquiries");
  return result;
}
