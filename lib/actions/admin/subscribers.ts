"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/client";
import { withAdmin, adminUpdate, adminDelete, type ActionResult } from "./guard";

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim() || !emailRegex.test(email.trim())) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const normalized = email.trim().toLowerCase();

  try {
    const supabase = await createClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", normalized)
      .maybeSingle();

    if (existing) {
      if (!existing.is_active) {
        // Reactivate
        await supabase
          .from("newsletter_subscribers")
          .update({ is_active: true })
          .eq("id", existing.id);
        revalidatePath("/admin/subscribers");
        return { success: true, message: "Welcome back! Your subscription has been reactivated." };
      }
      return { success: true, message: "You are already subscribed to our newsletter!" };
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: normalized, is_active: true }]);

    if (error) {
      // If unique constraint error
      if (error.code === "23505") {
        return { success: true, message: "You are already subscribed to our newsletter!" };
      }
      return { success: false, message: `Subscription failed: ${error.message}` };
    }

    revalidatePath("/admin/subscribers");
    return { success: true, message: "Thank you for subscribing to TORQUE updates!" };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

export async function setSubscriberActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("newsletter_subscribers", id, { is_active: isActive }, "Subscriber");
  if (result.success) revalidatePath("/admin/subscribers");
  return result;
}

export async function deleteSubscriber(id: string): Promise<ActionResult> {
  const result = await adminDelete("newsletter_subscribers", id, "Subscriber");
  if (result.success) revalidatePath("/admin/subscribers");
  return result;
}
