import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SPREADSHEET_ID = "1ox2JdavVqjsrm-Fm6BXPVA_QVBQe6eEX4JAkDuS2oqQ";
const SHEET_RANGE = "'1ფურცელი'!A:G";

const responseSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("rsvp"),
    attending: z.boolean(),
    name: z.string().trim().max(120),
    plusOne: z.boolean(),
    plusOneName: z.string().trim().max(120),
  }),
  z.object({
    type: z.literal("wish"),
    message: z.string().trim().min(3).max(1000),
  }),
]);

export const saveWeddingResponse = createServerFn({ method: "POST" })
  .inputValidator((data) => responseSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableApiKey = process.env["LOVABLE_API_KEY"];
    const sheetsApiKey = process.env["GOOGLE_SHEETS_API_KEY"];

    if (!lovableApiKey || !sheetsApiKey) {
      throw new Error("Google Sheets connection is not configured");
    }

    const submittedAt = new Intl.DateTimeFormat("ka-GE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tbilisi",
    }).format(new Date());

    const values =
      data.type === "rsvp"
        ? [
            submittedAt,
            "დასწრება",
            data.attending ? "კი" : "არა",
            data.name,
            data.plusOne ? "კი" : "არა",
            data.plusOneName,
            "",
          ]
        : [submittedAt, "სურვილი", "", "", "", "", data.message];

    const response = await fetch(
      `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "X-Connection-Api-Key": sheetsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ majorDimension: "ROWS", values: [values] }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Google Sheets request failed [${response.status}]: ${errorBody}`);
      throw new Error(`Google Sheets request failed [${response.status}]`);
    }

    return { saved: true };
  });