import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AssetDetailsStep from "./steps/AssetDetailsStep";
import PurposeStep from "./steps/PurposeStep";
import DurationStep from "./steps/DurationStep";
import ReviewStep from "./steps/ReviewStep";
import SecurityVerificationStep from "./steps/SecurityVerificationStep";

interface RequestFormProps {
  onSubmit?: (data: any) => void;
  initialStep?: number;
  initialData?: {
    assetDetails?: {
      requesterName: string;
      assetType: string;
      assetId: string;
      specifications: string;
      condition: string;
    };
    purpose?: {
      category: string;
      purpose: string;
      justification: string;
    };
    duration?: {
      startDate: Date;
      endDate: Date;
    };
  };
}

const RequestForm = ({
  onSubmit = () => {},
  initialStep = 0,
  initialData = {
    assetDetails: {
      requesterName: "",
      assetType: "",
      assetId: "",
      specifications: "",
      condition: "good",
    },
    purpose: {
      category: "work",
      purpose: "",
      justification: "",
    },
    duration: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
}: RequestFormProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    ...initialData,
    security: {
      floorGuardName: "",
      floorGuardSignature: "",
      gateGuardName: "",
      gateGuardSignature: "",
    },
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const updateAssetDetails = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      assetDetails: data,
    }));
  };

  const updatePurpose = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      purpose: data,
    }));
  };

  const updateDuration = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      duration: data,
    }));
  };

  const updateSecurity = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      security: data,
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AssetDetailsStep
            data={formData.assetDetails}
            onChange={updateAssetDetails}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <PurposeStep
            purpose={formData.purpose.purpose}
            justification={formData.purpose.justification}
            category={formData.purpose.category}
            onPurposeChange={(value) =>
              updatePurpose({ ...formData.purpose, purpose: value })
            }
            onJustificationChange={(value) =>
              updatePurpose({ ...formData.purpose, justification: value })
            }
            onCategoryChange={(value) =>
              updatePurpose({ ...formData.purpose, category: value })
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <DurationStep
            startDate={formData.duration.startDate}
            endDate={formData.duration.endDate}
            onStartDateChange={(date) =>
              updateDuration({ ...formData.duration, startDate: date })
            }
            onEndDateChange={(date) =>
              updateDuration({ ...formData.duration, endDate: date })
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <SecurityVerificationStep
            data={formData.security}
            onChange={updateSecurity}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReviewStep
            assetDetails={{
              name: formData.assetDetails.assetType,
              id: formData.assetDetails.assetId,
              type: formData.assetDetails.assetType,
            }}
            purpose={formData.purpose.purpose}
            duration={formData.duration}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-[800px] mx-auto bg-white p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Asset Gate Pass Request</h1>
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of 5
          </div>
        </div>

        {renderStep()}

        {currentStep < 3 && (
          <div className="flex justify-between pt-4">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button
              className={`${currentStep === 0 ? "ml-auto" : ""}`}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestForm;
