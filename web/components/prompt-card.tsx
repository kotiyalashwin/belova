"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SendHorizonal } from "lucide-react";
import * as motion from "motion/react-client";
import { generateRandomString } from "@/lib/randomId";

export default function InputCard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const value = inputRef.current?.value;
    if (value) {
      localStorage.setItem("prompt", value);
      const randomId = generateRandomString(10);
      router.push(`/project/${randomId}`);
    }
  };

  return (
    <div className="w-full z-10 max-w-7xl flex justify-center">
      <Card
        className="
          max-w-3xl w-full
          bg-neutral-900/70 
          border border-neutral-700/50 
          shadow-2xl 
          backdrop-blur-xl
        "
      >
        <CardContent>
          <input
            ref={inputRef}
            name="prompt"
            placeholder="Describe your next masterpiece..."
            className="
              block p-4 w-full text-xl 
              bg-transparent 
              focus:outline-none 
              text-neutral-100 
              placeholder:text-neutral-400
            "
          />

          <Button
            onClick={handleSubmit}
            className="tracking-widest mt-4 group   border border-neutral-600/40"
          >
            SUBMIT
            <span className="group-hover:translate-x-2 transition-transform duration-300">
              <SendHorizonal />
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
