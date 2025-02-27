import * as z from "zod";

export const assetDetailsSchema = z.object({
  assetId: z.string().optional(),
  assetType: z.string().min(1, "Asset type is required"),
  assetName: z.string().min(1, "Asset name is required"),
  assetModel: z.string().min(1, "Asset model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  tagNumber: z.string().min(1, "Tag number is required"),
  specifications: z.string().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
});

export const purposeSchema = z.object({
  category: z.enum([
    "work",
    "training",
    "event",
    "maintenance",
    "transfer",
    "disposal",
    "other",
  ]),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  justificationDocUrl: z.string().url("Please upload a justification document"),
});

export const durationSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    requireReturnConfirmation: z.boolean().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type AssetDetailsFormData = z.infer<typeof assetDetailsSchema>;
export type PurposeFormData = z.infer<typeof purposeSchema>;
export type DurationFormData = z.infer<typeof durationSchema>;

export const assetRequestSchema = z.object({
  assetDetails: assetDetailsSchema,
  purpose: purposeSchema,
  duration: durationSchema,
});

export type AssetRequestFormData = z.infer<typeof assetRequestSchema>;
