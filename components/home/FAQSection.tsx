"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Minus, HelpCircle, ChevronDown } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQData {
  sectionTitle: string;
  sectionSubtitle: string;
  items: FAQItem[];
}

export const defaultFAQData: FAQData = {
  sectionTitle: "Frequently Asked Questions",
  sectionSubtitle: "Everything you need to know about manufacturing with Bromely Sports / Estrella",
  items: [
    {
      id: "faq-1",
      question: "What is the minimum order quantity (MOQ) at Bromely Sports / Estrella?",
      answer:
        "Our flexible MOQ starts from as low as 20 to 50 pieces per design/colorway for private label startups, sports clubs, and custom team kits. For enterprise clients and commercial orders, we provide competitive tiered wholesale pricing.",
    },
    {
      id: "faq-2",
      question: "How long does custom sportswear manufacturing take?",
      answer:
        "Sample development typically takes 7 to 10 business days. Standard mass production orders are completed and dispatched within 2 to 3 weeks depending on the order size and customisation complexity.",
    },
    {
      id: "faq-3",
      question: "Do you offer private label and OEM manufacturing?",
      answer:
        "Yes, we specialize in full OEM and private label sportswear manufacturing. We produce garments to your exact tech packs, complete with custom neck labels, hang tags, woven badges, custom polybags, and branded packaging.",
    },
    {
      id: "faq-4",
      question: "What customisation options are available?",
      answer:
        "We offer full digital sublimation printing, silk screen printing, 3D puff embroidery, heat transfer vinyl, silicone grip printing, tackle twill, laser cutting, and custom fabric dyeing.",
    },
    {
      id: "faq-5",
      question: "Do you ship to the USA, UK, Europe, and Australia?",
      answer:
        "Yes! We ship globally via DHL, FedEx, UPS express air, as well as LCL/FCL sea freight for high-volume container shipments. All international shipments come with full door-to-door tracking and export customs documentation.",
    },
    {
      id: "faq-6",
      question: "What fabrics do you use for custom sportswear?",
      answer:
        "We use high-performance technical fabrics including moisture-wicking polyester, spandex/elastane blends, breathable honeycomb mesh, compression lycra, anti-bacterial fleece, and eco-friendly recycled yarns.",
    },
    {
      id: "faq-7",
      question: "Can I visit the Bromely / Estrella factory in Sialkot before placing an order?",
      answer:
        "We warmly welcome prospective clients, brand managers, and commercial partners to visit our manufacturing facilities in Sialkot, Pakistan. We also conduct live video walkthroughs of our stitching, printing, and quality audit lines.",
    },
    {
      id: "faq-8",
      question: "What is your quality control process?",
      answer:
        "Every single order undergoes a rigorous 4-stage quality audit: Raw Material Sourcing Audit, In-Line Panel Stitching Inspection, Heat Bonding & Printing Verification, and Pre-Packing Final Quality Audit prior to export.",
    },
  ],
};

export default function FAQSection() {
  const [data, setData] = useState<FAQData>(defaultFAQData);
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_faq");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
          setData({ ...defaultFAQData, ...parsed });
          return;
        }
      }

      const { data: dbData } = await supabase
        .from("home_sections")
        .select("*")
        .eq("section_key", "faq")
        .single();

      if (dbData && dbData.content) {
        setData({ ...defaultFAQData, ...dbData.content });
      } else {
        setData(defaultFAQData);
      }
    } catch {
      setData(defaultFAQData);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_faq");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
            setData({ ...defaultFAQData, ...parsed });
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_faq_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_faq_updated", handleUpdate);
    };
  }, [loadData]);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
      <div className="site-container max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#00AEF0]">
            <HelpCircle className="w-4 h-4" />
            <span>F&Q SECTION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            {data.sectionTitle}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            {data.sectionSubtitle}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {data.items.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id || idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 shadow-xs hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg transition-colors hover:text-[#00AEF0]"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#00AEF0] font-extrabold text-sm sm:text-base">
                      Q{idx + 1}.
                    </span>
                    <span>{item.question}</span>
                  </span>

                  <div className={`p-2 rounded-full transition-transform duration-300 shrink-0 ${
                    isOpen ? "bg-sky-100 text-[#00AEF0] rotate-180" : "bg-slate-100 text-slate-500"
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 font-medium animate-fade-in">
                    <p className="pt-4 pl-8 border-l-2 border-[#00AEF0]">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
