"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeBtn = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="outline"
      size="icon"
      className="cursor-pointer bg-inherit"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
    >
      {currentTheme === "dark" ? <SunMoon size={20} /> : <Moon size={20} />}
    </Button>
  );
};

export default ThemeBtn;
