import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estrella Admin CMS",
  description: "Admin dashboard for Estrella International business website",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
