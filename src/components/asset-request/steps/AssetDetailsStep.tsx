import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Card } from "@/components/ui/card";
import { useAssetRequest } from "@/contexts/AssetRequestContext";
import { assetService } from "@/services/assetService";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { AssetRequestFormData } from "@/lib/validations/asset-request";

interface AssetDetailsStepProps {
  onNext?: () => void;
}

const AssetDetailsStep = ({ onNext = () => {} }: AssetDetailsStepProps) => {
  const { state, dispatch } = useAssetRequest();
  const { accounts } = useMsal();
  const form = useFormContext<AssetRequestFormData>();

  if (!form) {
    return (
      <div className="p-4 text-red-500">
        Form context not found. Please ensure this component is used within a
        FormProvider.
      </div>
    );
  }

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const assets = await assetService.getAssets();
        dispatch({ type: "SET_ASSETS", payload: assets });
      } catch (error) {
        console.error("Error fetching assets:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch assets" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchAssets();
  }, [dispatch]);

  const handleAssetSelect = (assetId: string) => {
    const selectedAsset = state.assets.find((asset) => asset.id === assetId);
    if (selectedAsset) {
      form.setValue("assetDetails", {
        assetId: selectedAsset.id,
        assetType: selectedAsset.type,
        assetName: selectedAsset.name,
        assetModel: selectedAsset.model,
        serialNumber: selectedAsset.serial_number,
        tagNumber: selectedAsset.tag_number,
        specifications: selectedAsset.specifications || "",
        condition: selectedAsset.condition,
      });
    }
  };

  const availableAssets = state.assets.filter(
    (asset) => asset.status === "available",
  );

  const assetId = form.watch("assetDetails.assetId");

  return (
    <Card className="p-8 bg-white w-full max-w-[800px] shadow-lg">
      <div className="space-y-8">
        <div className="space-y-3 border-b pb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Asset Details
          </h2>
          <p className="text-gray-500 text-lg">
            Select an existing asset from inventory or enter details manually
          </p>
        </div>

        {state.loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Spinner size="lg" />
            <p className="text-sm text-gray-500">Loading available assets...</p>
          </div>
        ) : state.error ? (
          <div className="text-red-600 py-4">
            <p>{state.error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 space-y-4">
              <FormField
                control={form.control}
                name="assetDetails.assetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-blue-900">
                      Select Asset
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleAssetSelect(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Choose an asset from inventory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.name} - {asset.tag_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="assetDetails.assetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Asset Type
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!!assetId}
                        className={assetId ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetDetails.assetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Asset Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!!assetId}
                        className={assetId ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="assetDetails.assetModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Asset Model
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!!assetId}
                        className={assetId ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetDetails.serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Serial Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!!assetId}
                        className={assetId ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="assetDetails.tagNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Tag Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!!assetId}
                        className={assetId ? "bg-gray-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetDetails.condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Asset Condition
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!assetId}
                    >
                      <FormControl>
                        <SelectTrigger className={assetId ? "bg-gray-50" : ""}>
                          <SelectValue placeholder="Select asset condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assetDetails.specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      readOnly={!!assetId}
                      className={`min-h-[100px] ${assetId ? "bg-gray-50" : ""}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end pt-8 border-t">
          <Button onClick={onNext} size="lg" className="px-8">
            Continue to Purpose
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssetDetailsStep;
