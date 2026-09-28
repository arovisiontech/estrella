import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Estrella Admin CMS",
  description: "Admin portal for Estrella International website",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );

  const supabase = await createClient();
  const cookieStore = await cookies();
  const savedAdminEmail = cookieStore.get("estrella_admin_email")?.value || "admin@estrella.com";

  const {
    data: { user },
  } = isConfigured
    ? await supabase.auth.getUser()
    : { data: { user: { id: "dev", email: savedAdminEmail } as any } };

  // Protect dashboard routes - redirect to login if not authenticated
  const hasAuthCookie = cookieStore.get("sb-auth-token") || cookieStore.get("estrella_admin_email");
  if (!hasAuthCookie && isConfigured && !user) {
    redirect("/admin/login");
  }

  let profile: { full_name?: string; email?: string; role?: string; is_active?: boolean } | null = null;

  if (isConfigured && user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, role, is_active")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const adminEmail = profile?.email || user?.email || savedAdminEmail;
  const adminName = profile?.full_name || (adminEmail.split("@")[0] ? adminEmail.split("@")[0].toUpperCase() + " ADMIN" : "ESTRELLA ADMIN");

  return (
    <AdminLayoutClient adminName={adminName} adminEmail={adminEmail}>
      {children}
    </AdminLayoutClient>
  );
}
