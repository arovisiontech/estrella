"use server";

import { withAdmin, type ActionResult } from "./guard";

const ALLOWED_BUCKETS = [
  "products",
  "categories",
  "catalogues",
  "blogs",
  "events",
  "site-assets",
  "hero-slides",
  "media",
] as const;

export type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  products: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  categories: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  catalogues: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "application/pdf",
  ],
  blogs: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  events: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  "site-assets": [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "image/gif",
    "image/x-icon",
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/3gpp",
    "video/m4v",
    "video/avi",
    "video/mov",
  ],
  "hero-slides": [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/3gpp",
    "video/m4v",
    "video/avi",
    "video/mov",
  ],
};

const MAX_FILE_SIZES: Record<string, number> = {
  image: 50 * 1024 * 1024, // 50MB
  pdf: 10 * 1024 * 1024 * 1024, // 10GB (Unlimited size)
  video: 10 * 1024 * 1024 * 1024, // 10GB (Unlimited size)
};

export async function uploadAdminFile(formData: FormData): Promise<ActionResult<{ url: string; path: string; size: number }>> {
  return withAdmin(async (db) => {
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as AllowedBucket) || "site-assets";
    const customFolder = (formData.get("folder") as string) || "";

    if (!file) {
      return { success: false, message: "No file provided for upload." };
    }

    const isVideo = file.type.startsWith("video/") || Boolean(file.name.match(/\.(mp4|webm|ogg|mov|avi|mkv|m4v|3gp)$/i));
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    // Validate type if not a generic video/image
    const targetBucket = ALLOWED_BUCKETS.includes(bucket) ? bucket : "site-assets";
    const allowedMimes = ALLOWED_MIME_TYPES[targetBucket] || ALLOWED_MIME_TYPES["site-assets"];

    if (!isVideo && !isImage && !allowedMimes.includes(file.type)) {
      return {
        success: false,
        message: `File type '${file.type}' is not permitted.`,
      };
    }

    const maxLimit = isVideo
      ? MAX_FILE_SIZES.video
      : isPdf
        ? MAX_FILE_SIZES.pdf
        : MAX_FILE_SIZES.image;

    if (file.size > maxLimit) {
      const maxMb = Math.round(maxLimit / (1024 * 1024));
      return {
        success: false,
        message: `File size exceeds the ${maxMb}MB limit.`,
      };
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const filePath = customFolder
      ? `${customFolder.replace(/^\/+|\/+$/g, "")}/${timestamp}-${sanitizedName}`
      : `${timestamp}-${sanitizedName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Check if Supabase is properly configured
    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    );

    // Save locally function
    const saveToLocalDisk = async () => {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const uploadsDir = path.join(process.cwd(), "public", "uploads");

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const diskFilePath = path.join(uploadsDir, `${timestamp}-${sanitizedName}`);
        fs.writeFileSync(diskFilePath, buffer);

        const localPublicUrl = `/uploads/${timestamp}-${sanitizedName}`;
        return {
          success: true,
          message: "File uploaded successfully to local storage.",
          data: {
            url: localPublicUrl,
            path: `uploads/${timestamp}-${sanitizedName}`,
            size: file.size,
          },
        };
      } catch (diskErr: any) {
        console.error("Local disk upload error:", diskErr);
        return {
          success: false,
          message: `Local file save failed: ${diskErr.message || "Unknown error"}`,
        };
      }
    };

    if (!isSupabaseConfigured) {
      return await saveToLocalDisk();
    }

    const bucketsToTry: AllowedBucket[] = [
      targetBucket,
      targetBucket === "hero-slides" ? "site-assets" : "hero-slides",
      "products",
    ];

    let lastErrorMessage = "";

    try {
      for (const b of bucketsToTry) {
        try {
          await db.storage.createBucket(b, { public: true });
        } catch {}
        try {
          await db.storage.updateBucket(b, { public: true, fileSizeLimit: null as any, allowedMimeTypes: null as any });
        } catch {}

        const { error: err1 } = await db.storage
          .from(b)
          .upload(filePath, buffer, {
            contentType: file.type || (isVideo ? "video/mp4" : "application/octet-stream"),
            upsert: true,
          });

        if (!err1) {
          const { data: urlData } = db.storage.from(b).getPublicUrl(filePath);
          return {
            success: true,
            message: "File uploaded successfully.",
            data: {
              url: urlData.publicUrl,
              path: filePath,
              size: file.size,
            },
          };
        } else {
          lastErrorMessage = err1.message;
        }

        const { error: err2 } = await db.storage
          .from(b)
          .upload(filePath, buffer, {
            contentType: "application/octet-stream",
            upsert: true,
          });

        if (!err2) {
          const { data: urlData } = db.storage.from(b).getPublicUrl(filePath);
          return {
            success: true,
            message: "File uploaded successfully.",
            data: {
              url: urlData.publicUrl,
              path: filePath,
              size: file.size,
            },
          };
        } else {
          lastErrorMessage = err2.message;
        }
      }
    } catch (supabaseErr: any) {
      console.warn("Supabase storage error, falling back to local disk:", supabaseErr);
    }

    // Fallback to local disk if Supabase upload failed
    return await saveToLocalDisk();
  });
}

export async function deleteAdminFile(bucket: AllowedBucket, path: string): Promise<ActionResult> {
  return withAdmin(async (db) => {
    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return { success: false, message: `Invalid bucket '${bucket}'.` };
    }

    const { error } = await db.storage.from(bucket).remove([path]);
    if (error) {
      return { success: false, message: `Failed to remove storage file: ${error.message}` };
    }

    return { success: true, message: "File removed from storage." };
  });
}

export async function getSignedUploadUrl(
  bucket: AllowedBucket = "catalogues",
  folder: string = "media",
  fileName: string = "file"
): Promise<ActionResult<{ signedUrl: string; token: string; path: string; publicUrl: string; bucket: string }>> {
  return withAdmin(async (db) => {
    try {
      const timestamp = Date.now();
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const filePath = folder
        ? `${folder.replace(/^\/+|\/+$/g, "")}/${timestamp}-${sanitizedName}`
        : `${timestamp}-${sanitizedName}`;

      const primaryBucket = ALLOWED_BUCKETS.includes(bucket) ? bucket : "site-assets";
      const bucketsToTry: AllowedBucket[] = Array.from(
        new Set([primaryBucket, "catalogues", "media", "products", "site-assets", "blogs", "events", "hero-slides"])
      );

      let lastError = "";

      for (const b of bucketsToTry) {
        // Ensure bucket exists and has unrestricted limits
        try {
          await db.storage.createBucket(b, { public: true });
        } catch {
          // ignore if exists
        }
        try {
          await db.storage.updateBucket(b, {
            public: true,
            fileSizeLimit: null as any,
            allowedMimeTypes: null as any,
          });
        } catch {
          // ignore if update fails
        }

        const { data, error } = await db.storage.from(b).createSignedUploadUrl(filePath, { upsert: true });

        if (!error && data) {
          const { data: urlData } = db.storage.from(b).getPublicUrl(filePath);
          return {
            success: true,
            message: "Signed upload URL generated.",
            data: {
              signedUrl: data.signedUrl,
              token: data.token,
              path: filePath,
              publicUrl: urlData.publicUrl,
              bucket: b,
            },
          };
        } else if (error) {
          lastError = error.message;
        }
      }

      return {
        success: false,
        message: `Failed to generate signed upload URL: ${lastError || "Unknown error"}`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Error generating signed upload URL: ${err.message || "Unknown error"}`,
      };
    }
  });
}
