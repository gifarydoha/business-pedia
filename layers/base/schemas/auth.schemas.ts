import { z } from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    phone: z.string().regex(/^(?:\+8801|8801|01)[0-9]{9}$/, "Enter a valid Bangladeshi mobile number"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export const LoginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const ForgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export const QuickRegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Enter a valid email address"),
    contact_number: z.string().regex(/^(?:\+8801|8801|01)[0-9]{9}$/, "Enter a valid Bangladeshi mobile number"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Inferred types — use instead of writing separate payload interfaces
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type OtpInput = z.infer<typeof OtpSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type QuickRegisterInput = z.infer<typeof QuickRegisterSchema>;
