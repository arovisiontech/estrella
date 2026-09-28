"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactFormData, ContactFormErrors } from "@/lib/types/contact";
import { submitContactForm } from "@/app/(public)/contact/actions";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const inquiryOptions = [
  { value: "general-inquiry", label: "General Inquiry" },
  { value: "private-label", label: "Private Label Manufacturing" },
  { value: "bulk-production", label: "Bulk Production" },
  { value: "product-development", label: "Product Development" },
  { value: "catalogue-request", label: "Catalogue Request" },
  { value: "distribution", label: "Distribution Partnership" },
  { value: "event", label: "Event Inquiry" },
  { value: "support", label: "Support" },
];

const productOptions = [
  { value: "sportswears", label: "Custom Sportswear & Sublimation" },
  { value: "boxing-equipment", label: "Boxing & Martial Arts Equipment" },
  { value: "soccer-footballs", label: "Soccer Footballs & Match Balls" },
  { value: "surgical-instruments", label: "Surgical & Medical Instruments" },
  { value: "oem-manufacturing", label: "Custom OEM Manufacturing" },
  { value: "other", label: "Other" },
];

const contactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
];

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    inquiry_type: "general-inquiry",
    product_category: "sportswears",
    preferred_contact_method: "email",
    consent: false,
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [formStartTime] = useState(Date.now());

  // Listen for inquiry type selection from cards
  useEffect(() => {
    const handleSelectInquiry = (event: Event) => {
      const customEvent = event as CustomEvent<{ inquiryType: string }>;
      setFormData((prev) => ({
        ...prev,
        inquiry_type: customEvent.detail.inquiryType as any,
      }));
    };

    window.addEventListener("selectInquiry", handleSelectInquiry);
    return () => window.removeEventListener("selectInquiry", handleSelectInquiry);
  }, []);

  // Check for URL parameters to prefill form
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("inquiry")) {
      setFormData((prev) => ({
        ...prev,
        inquiry_type: params.get("inquiry") as any,
      }));
    }
    if (params.has("product")) {
      setFormData((prev) => ({
        ...prev,
        product_category: params.get("product") as any,
      }));
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const honeypotValue = honeypotRef.current?.value || "";
      const result = await submitContactForm(formData, formStartTime, honeypotValue);

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        });
        // Reset form
        setFormData({
          inquiry_type: "general-inquiry",
          product_category: "sportswears",
          preferred_contact_method: "email",
          consent: false,
        });
        setErrors({});

        // Scroll to success message
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message,
        });
        if (result.errors) {
          setErrors(result.errors);
        }
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="bg-zinc-50 py-16 sm:py-20 lg:py-24 scroll-mt-20">
      <div className="site-container px-12 sm:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00AEF0] mb-2">
                  LET'S DISCUSS
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-black">Tell Us About Your Project</h2>
              </div>
              <p className="text-base text-zinc-700">
                Share your requirements and our team will contact you with the next steps.
              </p>
            </div>

            {/* Status messages */}
            <AnimatePresence mode="wait">
              {submitStatus.type && (
                <motion.div
                  key={submitStatus.type}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-6 p-4 rounded-lg flex items-start gap-4 ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-[#00AEF0]/10 border border-[#00AEF0]/30"
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  ) : (
                    <AlertCircle className="text-[#00AEF0] flex-shrink-0 mt-0.5" size={20} />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      submitStatus.type === "success" ? "text-green-800" : "text-slate-800"
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                aria-hidden="true"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              {/* Row 1: Full Name & Company Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label="Full Name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name || ""}
                  error={errors.full_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <FormField
                  label="Company Name"
                  name="company_name"
                  type="text"
                  required
                  value={formData.company_name || ""}
                  error={errors.company_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email || ""}
                  error={errors.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <FormField
                  label="Phone / WhatsApp"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone || ""}
                  error={errors.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Row 3: Country & Inquiry Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label="Country"
                  name="country"
                  type="text"
                  required
                  value={formData.country || ""}
                  error={errors.country}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <FormSelect
                  label="Inquiry Type"
                  name="inquiry_type"
                  required
                  value={formData.inquiry_type || ""}
                  error={errors.inquiry_type}
                  options={inquiryOptions}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Row 4: Product Category & Estimated Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormSelect
                  label="Product Category"
                  name="product_category"
                  required
                  value={formData.product_category || ""}
                  error={errors.product_category}
                  options={productOptions}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <FormField
                  label="Estimated Quantity (optional)"
                  name="estimated_quantity"
                  type="number"
                  value={formData.estimated_quantity || ""}
                  error={errors.estimated_quantity}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Row 5: Subject */}
              <FormField
                label="Subject"
                name="subject"
                type="text"
                required
                value={formData.subject || ""}
                error={errors.subject}
                onChange={handleChange}
                disabled={isSubmitting}
              />

              {/* Row 6: Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-black">
                  Message <span className="text-[#00AEF0]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg font-mono text-sm transition-all duration-300 focus:outline-none resize-none ${
                    errors.message
                      ? "border-[#00AEF0] focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
                      : "border-zinc-300 focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-sm text-[#00AEF0]">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Row 7: Preferred Contact Method */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-black">
                  Preferred Contact Method <span className="text-[#00AEF0]">*</span>
                </p>
                <div className="space-y-2">
                  {contactMethodOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="preferred_contact_method"
                        value={option.value}
                        checked={formData.preferred_contact_method === option.value}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-4 h-4 text-[#00AEF0] border-zinc-300 focus:ring-[#00AEF0]"
                      />
                      <span className="text-sm text-zinc-700 group-hover:text-black transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.preferred_contact_method && (
                  <p className="text-sm text-[#00AEF0]">{errors.preferred_contact_method}</p>
                )}
              </div>

              {/* Row 8: Consent */}
              <div className="space-y-2 pt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent || false}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 mt-1 text-[#00AEF0] border-zinc-300 rounded focus:ring-[#00AEF0] flex-shrink-0"
                  />
                  <span className="text-sm text-zinc-700">
                    I agree to provide my information for inquiry processing and contact follow-up.
                  </span>
                </label>
                {errors.consent && <p className="text-sm text-[#00AEF0]">{errors.consent}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#00AEF0] hover:bg-[#0089bd] disabled:bg-zinc-400 text-white font-semibold rounded-lg transition-all duration-300 group mt-8 shadow-md shadow-[#00AEF0]/20"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    SEND INQUIRY
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right column - Process panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="hidden lg:flex flex-col"
          >
            <div className="bg-white border border-zinc-200 rounded-lg p-8 space-y-8 sticky top-32">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00AEF0] mb-4">
                  OUR PROCESS
                </p>
                <h3 className="text-2xl font-bold text-black">How It Works</h3>
              </div>

              {/* Process steps */}
              {[
                { num: 1, title: "Share Requirements", desc: "Tell us what you need" },
                { num: 2, title: "Product Discussion", desc: "We review your specs" },
                { num: 3, title: "Sampling & Approval", desc: "Prototypes and review" },
                { num: 4, title: "Production Planning", desc: "Full-scale manufacturing" },
              ].map((step, index) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00AEF0] text-white font-bold text-sm shadow-sm">
                      {step.num}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-black text-sm">{step.title}</h4>
                    <p className="text-xs text-zinc-600 mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Reusable form field component
function FormField({
  label,
  name,
  type = "text",
  required = false,
  value,
  error,
  onChange,
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-black">
        {label}
        {required && <span className="text-[#00AEF0]">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-300 focus:outline-none ${
          error
            ? "border-[#00AEF0] focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
            : "border-zinc-300 focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-[#00AEF0]">
          {error}
        </p>
      )}
    </div>
  );
}

// Reusable select component
function FormSelect({
  label,
  name,
  required = false,
  value,
  error,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  error?: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-black">
        {label}
        {required && <span className="text-[#00AEF0]">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg text-sm transition-all duration-300 focus:outline-none ${
          error
            ? "border-[#00AEF0] focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
            : "border-zinc-300 focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-sm text-[#00AEF0]">
          {error}
        </p>
      )}
    </div>
  );
}

