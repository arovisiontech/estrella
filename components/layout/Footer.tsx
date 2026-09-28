import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { contactInfo, agencyInfo } from "@/lib/data/footer";
import NewsletterForm from "./NewsletterForm";
import SocialLinks from "./SocialLinks";
import { getFooterQuickLinks, getFooterProducts } from "@/lib/cms";

export default async function Footer() {
  const quickLinks = await getFooterQuickLinks();
  const productLinks = await getFooterProducts();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="site-container px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-8 sm:py-10 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00AEF0] mb-1">
                Building Your Vision
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight max-w-lg">
                Let&apos;s Build Something Amazing.
              </h2>
            </div>
            <Link
              href={contactInfo.ctaLink}
              className="inline-block px-6 py-3 bg-[#00AEF0] text-white text-sm font-bold rounded-full hover:bg-[#0095ce] transition-all duration-300 shadow-md whitespace-nowrap"
            >
              LET&apos;S DISCUSS
            </Link>
          </div>
        </div>

        {/* Logo and Newsletter Section */}
        <div className="py-8 sm:py-10 border-b border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Logo */}
            <div className="relative flex items-center max-w-fit">
              <Image
                src="/estrella_logo_transparent.png"
                alt="Estrella International"
                width={280}
                height={65}
                className="h-12 sm:h-16 w-auto object-contain"
                priority
                unoptimized
              />
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3">
                Sign Up For Newsletter
              </h3>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Information Columns Section */}
        <div className="py-8 sm:py-10 border-b border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Location Info */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#00AEF0] mb-3">
                Our Locations
              </h3>
              <div className="space-y-2.5">
                <div>
                  <p className="text-sm text-white font-semibold">
                    Estrella International Solutions Ltd.
                  </p>
                  <p className="text-sm text-slate-400">{contactInfo.location}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-[#00AEF0] shrink-0" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-sm text-slate-400 hover:text-[#00AEF0] transition-colors duration-300"
                  >
                    {contactInfo.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-[#00AEF0] shrink-0" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-slate-400 hover:text-[#00AEF0] transition-colors duration-300"
                  >
                    {contactInfo.email}
                  </a>
                </div>

                <div className="pt-2">
                  <SocialLinks />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#00AEF0] mb-3">
                Quick Links
              </h3>
              <nav className="space-y-2">
                <ul className="space-y-2">
                  {quickLinks.filter(link => link.href).map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href!}
                        className="text-sm text-slate-400 hover:text-[#00AEF0] transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Product Range */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#00AEF0] mb-3">
                Solutions & Services
              </h3>
              <nav className="space-y-2">
                <ul className="space-y-2">
                  {productLinks.filter(link => link.href).map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href!}
                        className="text-sm text-slate-400 hover:text-[#00AEF0] transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-5">
          <p className="text-center text-xs sm:text-sm text-slate-400">
            © {currentYear} Estrella International Solutions. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
