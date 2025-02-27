import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AssetDetailsStep from "./steps/AssetDetailsStep";
import PurposeStep from "./steps/PurposeStep";
import DurationStep from "./steps/DurationStep";
import ReviewStep from "./steps/ReviewStep";
import { useAssetRequest } from "@/contexts/AssetRequestContext";
import { Spinner } from "@/components/ui/spinner";
import {
  assetRequestSchema,
  type AssetRequestFormData,
} from "@/lib/validations/asset-request";

interface RequestFormProps {
  initialStep?: number;
  onSubmit?: (data: AssetRequestFormData) => void;
}

const RequestForm = ({
  initialStep = 0,
  onSubmit = () => {},
}: RequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const methods = useForm<AssetRequestFormData>({
    resolver: zodResolver(assetRequestSchema),
    defaultValues: {
      assetDetails: {
        assetId: "",
        assetType: "",
        assetName: "",
        assetModel: "",
        serialNumber: "",
        tagNumber: "",
        specifications: "",
        condition: "good",
      },
      purpose: {
        category: "work",
        purpose: "",
        justificationDocUrl: "",
      },
      duration: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        requireReturnConfirmation: false,
        notes: "",
      },
    },
    mode: "onChange",
  });

  const handleNext = async () => {
    let canProceed = false;

    switch (currentStep) {
      case 0:
        canProceed = await methods.trigger("assetDetails");
        break;
      case 1:
        canProceed = await methods.trigger("purpose");
        break;
      case 2:
        canProceed = await methods.trigger("duration");
        break;
      default:
        canProceed = true;
    }

    if (canProceed) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AssetDetailsStep onNext={handleNext} />;
      case 1:
        return <PurposeStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <DurationStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <ReviewStep onSubmit={handleSubmit} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="w-full">
        {renderStep()}
      </form>
    </FormProvider>
  );
};

export default RequestForm;
