import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { saveWeddingResponse } from "@/lib/wedding-responses.functions";
const cake = { url: "/images/rsvp-cake.png" };

type Answer = "yes" | "no" | null;

const inputClass =
  "w-full rounded-md border border-olive/25 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-olive";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-olive/20 bg-white shadow-[0_20px_50px_-30px_rgba(60,70,40,0.45)] lg:max-w-lg">
      <div className="flex items-end justify-center bg-olive-mist/60 px-6 pt-6">
        <img
          src={cake.url}
          alt="თეთრი საქორწილო ტორტი"
          loading="lazy"
          decoding="async"
          width={750}
          height={1057}
          className="reveal-image h-72 w-auto object-contain mix-blend-multiply sm:h-80"
        />
      </div>
      <div className="px-6 pb-10 pt-8 text-center sm:px-8">{children}</div>
    </div>
  );
}

export function Rsvp() {
  const saveResponse = useServerFn(saveWeddingResponse);
  const [answer, setAnswer] = useState<Answer>(null);
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = answer !== null && name.trim().length > 1;

  if (sent) {
    return (
      <Card>
        <p className="animate-fade-in font-display text-xl font-light text-olive">
          {answer === "yes" ? "გმადლობთ! ველოდებით." : "გმადლობთ პასუხისთვის."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-[0.65rem] tracking-[0.45em] text-olive">დასწრება</p>
      <h2 className="mt-4 font-display text-2xl font-light text-olive sm:text-3xl">
        შეძლებთ მობრძანებას?
      </h2>
      <div className="hairline mx-auto mt-6 w-28" />

      <form
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!canSend || saving) return;
          setSaving(true);
          setError(null);
          try {
            await saveResponse({
              data: {
                attending: answer === "yes",
                name: name.trim(),
              },
            });
            setSent(true);
          } catch {
            setError("ვერ გაიგზავნა, სცადეთ ხელახლა");
          } finally {
            setSaving(false);
          }
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              { value: "yes", label: "სიამოვნებით" },
              { value: "no", label: "სამწუხაროდ ვერ" },
            ] as const
          ).map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setAnswer(o.value)}
              className={`rounded-full border px-4 py-3 text-sm transition-all duration-300 ${
                answer === o.value
                  ? "border-olive bg-olive text-white shadow-[0_10px_24px_-14px_rgba(70,85,45,0.9)]"
                  : "border-olive/25 bg-white text-ink/80 hover:border-olive/60 hover:bg-olive-mist/50"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {answer && (
          <label className="block animate-fade-in text-left">
            <span className="text-[0.65rem] tracking-[0.3em] text-olive">სახელი, გვარი</span>
            <input
              className={`mt-2 ${inputClass}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="სახელი გვარი"
            />
          </label>
        )}

        {answer && (
          <button
            type="submit"
            disabled={!canSend || saving}
            className="w-full animate-fade-in rounded-full bg-olive px-6 py-3 text-sm tracking-[0.25em] text-white transition-opacity disabled:opacity-40"
          >
            {saving ? "იგზავნება..." : "გაგზავნა"}
          </button>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>
    </Card>
  );
}
