"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/context/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";
import { LogOut } from "lucide-react";

export function SettingsView() {
  const { profile, dispatch } = useAppStore();
  const [fullName, setFullName] = React.useState(profile.fullName);
  const [email, setEmail] = React.useState(profile.email);
  const [school, setSchool] = React.useState(profile.school);

  React.useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setSchool(profile.school);
  }, [profile.fullName, profile.email, profile.school]);

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    dispatch({
      type: "UPDATE_PROFILE",
      payload: {
        fullName: fullName.trim() || profile.fullName,
        email: email.trim() || profile.email,
        school: school.trim() || profile.school,
      },
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Podešavanja</h1>
        <p className="text-muted-foreground">
          Tema i osnovni podaci — kasnije ovde dodajemo nalog i Supabase bezbednosne opcije.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Izgled</CardTitle>
            <CardDescription>Svetla, tamna ili sistemska tema.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Tema aplikacije</p>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Profil</CardTitle>
            <CardDescription>Ovi podaci se trenutno čuvaju lokalno u pregledaču.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Ime i prezime</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">Škola</Label>
                <Input
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
              <Button type="submit">Sačuvaj izmene</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sesija</CardTitle>
            <CardDescription>Autentifikacija će koristiti Supabase kada ga povežeš.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/login">
                <LogOut className="size-4" />
                Odjavi se (demo)
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
