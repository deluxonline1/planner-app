import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Unesi ispravan email."),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera."),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Unesi ime i prezime."),
    email: z.string().email("Unesi ispravan email."),
    password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Lozinke se ne poklapaju.",
    path: ["confirm"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
