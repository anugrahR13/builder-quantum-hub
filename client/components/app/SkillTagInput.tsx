import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SkillTagInput({ value, onChange, placeholder }: { value: string[]; onChange: (skills: string[]) => void; placeholder?: string; }) {
  const [input, setInput] = useState("");

  const add = (val: string) => {
    const v = val.trim().toLowerCase();
    if (!v) return;
    if (value.includes(v)) return;
    onChange([...value, v]);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-md border p-2 bg-background">
      {value.map((skill) => (
        <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-1 text-xs">
          {skill}
          <button
            type="button"
            onClick={() => onChange(value.filter((s) => s !== skill))}
            className="hover:text-foreground"
            aria-label={`Remove ${skill}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder || "Add a skill and press Enter"}
        className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[10ch]"
      />
    </div>
  );
}
