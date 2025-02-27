import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { AssetRequestFormData } from "@/lib/validations/asset-request";

interface PurposeStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

const PurposeStep = ({
  onNext = () => {},
  onBack = () => {},
}: PurposeStepProps) => {
  const form = useFormContext<AssetRequestFormData>();

  if (!form) {
    return (
      <div className="p-4 text-red-500">
        Form context not found. Please ensure this component is used within a
        FormProvider.
      </div>
    );
  }

  return (
    <Card className="p-6 bg-white w-full max-w-[700px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Purpose Details</h2>
          <p className="text-gray-500">
            Please provide information about why you need this asset
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="purpose.category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="work">Work Related</SelectItem>
                    <SelectItem value="training">Training/Workshop</SelectItem>
                    <SelectItem value="event">Event/Conference</SelectItem>
                    <SelectItem value="maintenance">
                      Maintenance/Repair
                    </SelectItem>
                    <SelectItem value="transfer">Branch Transfer</SelectItem>
                    <SelectItem value="disposal">Disposal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose.purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Purpose</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brief purpose" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose.justificationDocUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Justification Document</FormLabel>
                <div className="mt-2">
                  <FileUpload
                    onUploadComplete={(url) => {
                      field.onChange(url);
                    }}
                    onError={(error) => {
                      console.error("Upload error:", error);
                    }}
                    maxSize={10}
                    allowedTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                    bucketName="justification-docs"
                  />
                </div>
                {field.value && (
                  <div className="mt-2 p-3 bg-gray-50 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Document uploaded successfully
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={field.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View Document
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => field.onChange("")}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {field.value.split("/").pop()}
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Please upload a PDF document or image containing detailed
                  justification for your request
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </div>
      </div>
    </Card>
  );
};

export default PurposeStep;
