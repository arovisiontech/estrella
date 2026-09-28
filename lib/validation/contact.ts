import { ContactFormData, ContactFormErrors } from "@/lib/types/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s\-()]+$/;
const MIN_MESSAGE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2000;

export function validateContactForm(data: Partial<ContactFormData>): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.full_name?.trim()) {
    errors.full_name = "Full name is required";
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = "Full name must be at least 2 characters";
  }

  if (!data.company_name?.trim()) {
    errors.company_name = "Company name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!PHONE_REGEX.test(data.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!data.country?.trim()) {
    errors.country = "Country is required";
  }

  if (!data.inquiry_type) {
    errors.inquiry_type = "Please select an inquiry type";
  }

  if (!data.product_category) {
    errors.product_category = "Please select a product category";
  }

  if (data.estimated_quantity) {
    const quantity = parseInt(data.estimated_quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      errors.estimated_quantity = "Quantity must be a positive number";
    }
  }

  if (!data.subject?.trim()) {
    errors.subject = "Subject is required";
  } else if (data.subject.trim().length < 5) {
    errors.subject = "Subject must be at least 5 characters";
  }

  if (!data.message?.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  } else if (data.message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`;
  }

  if (!data.preferred_contact_method) {
    errors.preferred_contact_method = "Please select a preferred contact method";
  }

  if (!data.consent) {
    errors.consent = "You must agree to our terms";
  }

  return errors;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim()) && phone.trim().length >= 10;
}
