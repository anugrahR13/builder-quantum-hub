import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const send = async () => {
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    const res = await fetch("/api/agent/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next })});
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", content: data.reply || "" }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <Card className="w-80 h-96 p-3 flex flex-col gap-2">
          <div className="flex-1 overflow-auto space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className="inline-block rounded-md px-2 py-1 text-sm border bg-card">{m.content}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="flex-1 border rounded px-2 text-sm h-9 bg-background" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask for advice..." />
            <Button size="sm" onClick={send} disabled={!input.trim()}>Send</Button>
          </div>
        </Card>
      )}
      <Button onClick={() => setOpen((v) => !v)} className="rounded-full shadow-lg">{open ? "Close AI" : "Ask AI"}</Button>
    </div>
  );
}
