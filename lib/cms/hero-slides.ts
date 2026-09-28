import { createClient } from "@/lib/supabase/client";
import { readLocalStore } from "./localStore";

export interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image_url?: string;
  mobile_image_url?: string;
  video_url?: string;
  button_text?: string;
  button_url?: string;
  text_position?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function getLocalHeroSlides(): HeroSlide[] {
  try {
    const store = readLocalStore();
    if (!store.hero_slides || store.hero_slides.length === 0) return [];
    return store.hero_slides.map((s: any) => ({
      id: String(s.id),
      eyebrow: s.eyebrow || "",
      title: s.title || "",
      description: s.description || "",
      image_url: s.image_url || "/images/banner.png",
      mobile_image_url: s.mobile_image_url || s.image_url || "",
      video_url: s.video_url || "",
      button_text: s.button_text || "",
      button_url: s.button_url || "",
      text_position: s.text_position || "left",
      sort_order: Number(s.sort_order) || 1,
      is_active: Boolean(s.is_active !== false),
      created_at: s.created_at || new Date().toISOString(),
      updated_at: s.updated_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Error reading local hero slides:", err);
    return [];
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const localSlides = getLocalHeroSlides();

  try {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return localSlides;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return localSlides;
    }

    return data;
  } catch {
    return localSlides;
  }
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const localSlides = getLocalHeroSlides();

  try {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return localSlides;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return localSlides;
    }

    return data;
  } catch {
    return localSlides;
  }
}
