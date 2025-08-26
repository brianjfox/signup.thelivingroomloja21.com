import { z } from 'zod';

// Step 1 validation schema
export const step1Schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  tlrCode: z
    .string()
    .min(1, 'TLR Code is required')
    .length(3, 'TLR Code must be exactly 3 digits')
    .regex(/^\d{3}$/, 'TLR Code must contain only numbers'),
});

// Step 2 validation schema
export const step2Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .min(9, 'Phone number must be at least 9 digits'),
  nif: z
    .string()
    .min(1, 'NIF is required')
    .min(9, 'NIF must be at least 9 digits'),
  address: z
    .string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters'),
  tlrCode: z.string().length(3, 'TLR Code must be exactly 3 digits'),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
