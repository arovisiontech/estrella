import Link from "next/link";
import { FooterLink } from "@/lib/data/footer";

type FooterLinkGroupProps = {
  title: string;
  links: FooterLink[];
};

export default function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
        {title}
      </h3>
      <nav className="space-y-3">
        <ul>
          {links.map((link) => (
            <li key={link.id || link.label}>
              <Link
                href={link.href || "#"}
                className="text-slate-400 hover:text-[#00AEF0] transition-colors duration-300 text-sm inline-flex items-center gap-2"
              >
                {link.label}
                {link.count !== undefined && (
                  <span className="text-xs text-slate-500">
                    ({link.count})
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
