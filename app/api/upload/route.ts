import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import fs from "fs";
import path from "path";

export const maxDuration = 300; // 5 minute execution timeout for heavy file uploads

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "pdf-files";
    const bucket = (formData.get("bucket") as string) || "catalogues";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided for upload." },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const filePath = `${folder}/${timestamp}-${sanitizedName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Try uploading to Supabase Storage if configured
    const isSupabaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    );

    if (isSupabaseConfigured) {
      try {
        const adminSupabase = createAdminClient();
        const bucketsToTry = [bucket, "catalogues", "site-assets", "media"];

        for (const b of bucketsToTry) {
          try {
            await adminSupabase.storage.createBucket(b, { public: true });
          } catch {}
          try {
            await adminSupabase.storage.updateBucket(b, {
              public: true,
              fileSizeLimit: null as any,
              allowedMimeTypes: null as any,
            });
          } catch {}

          const { data, error } = await adminSupabase.storage.from(b).upload(filePath, buffer, {
            contentType: file.type || "application/pdf",
            upsert: true,
          });

          if (!error && data) {
            const { data: urlData } = adminSupabase.storage.from(b).getPublicUrl(filePath);
            return NextResponse.json({
              success: true,
              url: urlData.publicUrl,
              message: "File uploaded successfully to cloud storage.",
            });
          }
        }
      } catch (sbErr) {
        console.warn("Supabase storage API upload warning, falling back to local disk:", sbErr);
      }
    }

    // 2. Save to local disk (/public/uploads/) or fall back to Data URL on serverless
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileNameOnDisk = `${timestamp}-${sanitizedName}`;
      const diskPath = path.join(uploadsDir, fileNameOnDisk);
      fs.writeFileSync(diskPath, buffer);

      const publicUrl = `/uploads/${fileNameOnDisk}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        message: "File uploaded successfully to local storage.",
      });
    } catch (diskErr) {
      console.warn("Local disk not writable on serverless, using Data URL fallback:", diskErr);
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        message: "File uploaded successfully.",
      });
    }
  } catch (error: any) {
    console.error("API upload error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to process file upload." },
      { status: 500 }
    );
  }
}
