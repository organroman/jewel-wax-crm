"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Search } from "lucide-react";

import { Input } from "../ui/input";

interface SearchProps {
  placeholder?: string;
  param?: string;
}

const SearchInput = ({
  placeholder = "Пошук",
  param = "search",
}: SearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValues] = useState<string>(searchParams.get(param) || "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams);

      if (value.trim()) {
        params.set(param, value.trim());
      } else {
        params.delete(param);
      }
      router.push(`?${params.toString()}`);
    }
  };
  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-light" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValues(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 bg-ui-sidebar w-[280px] placeholder:text-text-light placeholder:text-xs "
      />
    </div>
  );
};

export default SearchInput;
