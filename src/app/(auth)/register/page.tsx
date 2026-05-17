"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  async function onSubmit(data: RegisterValues) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-10 w-full max-w-md"
    >
      <Card className="border-border/80 shadow-xl shadow-black/5 dark:shadow-black/30">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Sparkles className="size-6" aria-hidden />
          </div>

          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Kreiraj Delux nalog
            </CardTitle>

            <CardDescription className="text-base">
              Registruj se i počni organizovati zadatke i raspored.
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ime i prezime</Label>

              <Input
                id="fullName"
                autoComplete="name"
                {...form.register("fullName")}
              />

              {form.formState.errors.fullName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register("email")}
              />

              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>

              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...form.register("password")}
              />

              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Potvrdi lozinku</Label>

              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                {...form.register("confirm")}
              />

              {form.formState.errors.confirm && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirm.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" size="lg">
              Registracija
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Već imaš nalog?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Prijavi se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}