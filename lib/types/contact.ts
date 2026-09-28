export type InquiryType =
  | "general-inquiry"
  | "private-label"
  | "bulk-production"
  | "product-development"
  | "catalogue-request"
  | "distribution"
  | "event"
  | "support";

export type ProductCategory =
  | "sportswears"
  | "boxing-equipment"
  | "soccer-footballs"
  | "surgical-instruments"
  | "oem-manufacturing"
  | "protective-jackets"
  | "motorbike-leather-jackets"
  | "touring-jackets"
  | "winter-gloves"
  | "summer-gloves"
  | "textile-trousers"
  | "other";

export type PreferredContactMethod = "email" | "phone" | "whatsapp";

export interface ContactFormData {
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  country: string;
  inquiry_type: InquiryType;
  product_category: ProductCategory;
  estimated_quantity: string;
  subject: string;
  message: string;
  preferred_contact_method: PreferredContactMethod;
  consent: boolean;
}

export interface ContactFormErrors {
  [key: string]: string | undefined;
}

export interface SubmitResult {
  success: boolean;
  message: string;
  errors?: ContactFormErrors;
}
