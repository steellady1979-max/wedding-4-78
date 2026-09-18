import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { saveWeddingResponse } from "@/lib/wedding-responses.functions";
const envelope = { url: "/images/wish-envelope.png" };

export function WishEnvelope() {
  const saveResponse = useServerFn(saveWeddingResponse);
  const [open, setOpen] = useState(false);
  const [wish, setWish] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 lg:max-w-lg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group relative w-[70vw] max-w-[320px] cursor-pointer transition-transform duration-500 hover:scale-[1.03] lg:w-[340px] lg:max-w-none"

        aria-expanded={open}
      >
        <img
          src={envelope.url}
          alt="სურვილების კონვერტი — თეთრი კონვერტი მაქმანის ბაფთით"
          loading="lazy"
          decoding="async"
          width={900}
          height={1269}
          className={`reveal-image w-full transition-transform duration-700 ease-drape ${
            open ? "-translate-y-2 rotate-[-1deg]" : ""
          }`}
        />
        <span className="pointer-events-none absolute inset-x-0 top-[34%] text-center font-display text-base tracking-[0.3em] text-olive sm:text-lg">
          დააჭირე აქ
        </span>
      </button>

      {open && (
        <div className="w-full animate-fade-in space-y-4 text-center">
          {sent ? (
            <p className="font-display text-xl font-light text-olive">
              გმადლობთ თბილი სიტყვებისთვის
            </p>
          ) : (
            <>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                rows={4}
                maxLength={1000}
                aria-label="სურვილი"
                className="w-full resize-none rounded-md border border-olive/25 bg-white px-4 py-3 font-display text-lg leading-relaxed text-ink outline-none transition-colors focus:border-olive"
              />
              <button
                type="button"
                disabled={wish.trim().length < 3 || saving}
                onClick={async () => {
                  setSaving(true);
                  setError(null);
                  try {
                    await saveResponse({ data: { type: "wish", message: wish.trim() } });
                    setSent(true);
                  } catch {
                    setError("ვერ გაიგზავნა, სცადეთ ხელახლა");
                  } finally {
                    setSaving(false);
                  }
                }}
                className="w-full rounded-md bg-olive px-6 py-3 text-sm tracking-[0.25em] text-white transition-opacity disabled:opacity-40"
              >
                {saving ? "იგზავნება..." : "სურვილის დატოვება"}
              </button>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
