"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden md:flex justify-center gap-1 items-center ">
      <Button
        variant="ghost"
        onClick={() => setTheme("light")}
        className="hover:bg-stone-600 dark:hover:bg-stone-600 hover:text-gray-200 dark:hover:text-gray-200 gap-0 p-1 h-fit has-[>svg]:px-1"
      >
        <Sun
          className={cn(
            "text-gray-400 transition-all",
            theme === "light" && "text-white dark:text-white"
          )}
        />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Separator
        orientation="vertical"
        className="bg-neutral-300 data-[orientation=vertical]:h-1/2"
      />
      <Button
        variant="ghost"
        onClick={() => setTheme("dark")}
        className="hover:bg-stone-600 dark:hover:bg-stone-600 gap-0 p-1 h-fit has-[>svg]:px-1"
      >
        <Moon
          className={cn(
            "text-gray-400 transition-all",
            theme === "dark" && "text-white dark:text-white"
          )}
        />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
