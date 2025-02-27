import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { userService } from "@/services/userService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { requestService } from "@/services/requestService";
import { notificationService } from "@/services/notificationService";
import { approvalService } from "@/services/approvalService";
import { useMsal } from "@azure/msal-react";
import type { AssetRequestFormData } from "@/lib/validations/asset-request";
import { useToast } from "@/components/ui/use-toast";

interface ReviewStepProps {
  onSubmit?: () => void;
  onBack?: () => void;
}

const ReviewStep = ({
  onSubmit = () => {},
  onBack = () => {},
}: ReviewStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useFormContext<AssetRequestFormData>();
  const { accounts } = useMsal();
  const { toast } = useToast();
  const activeAccount = accounts[0];

  if (!form) {
    return (
      <div className="p-4 text-red-500">
        <AlertCircle className="w-6 h-6 mb-2" />
        <p>
          Form context not found. Please ensure this component is used within a
          FormProvider.
        </p>
      </div>
    );
  }

  const formData = form.getValues();

  const handleSubmit = async () => {
    if (!activeAccount?.username) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Get user's department
      const userDepartment = await userService.getUserDepartment(
        activeAccount.username,
      );

      if (!userDepartment) {
        throw new Error("User department not found");
      }

      // Create the asset request
      const request = await requestService.createRequest({
        asset_id: formData.assetDetails.assetId || "",
        requester_id: activeAccount.username,
        requester_type: "staff",
        purpose: formData.purpose.purpose,
        purpose_category: formData.purpose.category,
        justification: formData.purpose.justificationDocUrl,
        start_date: formData.duration.startDate.toISOString(),
        end_date: formData.duration.endDate.toISOString(),
        status: "pending",
        branch_id: userDepartment.branch_id || "default",
        department_id: userDepartment.id,
      });

      // Create initial approvals
      await Promise.all([
        approvalService.createApproval({
          request_id: request.id,
          approver_id: "department_head",
          approver_role: "department_head",
          status: "pending",
        }),
        approvalService.createApproval({
          request_id: request.id,
          approver_id: "ict_officer",
          approver_role: "ict",
          status: "pending",
        }),
      ]);

      // Create notification for the department head
      await notificationService.createNotification({
        user_id: "department_head",
        title: "New Asset Request",
        message: `New asset request from ${activeAccount.name} requires your approval`,
        type: "request",
        link: `/requests/${request.id}`,
      });

      toast({
        title: "Request Submitted",
        description: "Your asset request has been submitted successfully.",
      });

      onSubmit();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Review Gate Pass Request</h2>
          <p className="text-gray-500">
            Please review all details before submission
          </p>
        </div>
        <img src="/kma-logo.png" alt="KMA Logo" className="h-16" />
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Asset Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Asset Name</p>
              <p className="font-medium">{formData.assetDetails.assetName}</p>
            </div>
            <div>
              <p className="text-gray-500">Asset Type</p>
              <p className="font-medium">{formData.assetDetails.assetType}</p>
            </div>
            <div>
              <p className="text-gray-500">Model</p>
              <p className="font-medium">{formData.assetDetails.assetModel}</p>
            </div>
            <div>
              <p className="text-gray-500">Serial Number</p>
              <p className="font-medium">
                {formData.assetDetails.serialNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Tag Number</p>
              <p className="font-medium">{formData.assetDetails.tagNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Condition</p>
              <p className="font-medium capitalize">
                {formData.assetDetails.condition}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Purpose & Duration</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium capitalize">
                {formData.purpose.category}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Purpose</p>
              <p className="font-medium">{formData.purpose.purpose}</p>
            </div>
            <div>
              <p className="text-gray-500">Justification Document</p>
              <a
                href={formData.purpose.justificationDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View Document
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Start Date</p>
                <p className="font-medium">
                  {formData.duration.startDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Return Date</p>
                <p className="font-medium">
                  {formData.duration.endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="text-yellow-500 w-5 h-5 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-yellow-800">Important Notice</p>
          <p className="text-yellow-700">
            This gate pass must be printed and signed by both floor and gate
            security personnel before the asset can be moved. For branch
            transfers, both origin and destination security personnel must
            verify. For disposals, the Asset Disposal Committee's approval is
            required.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Generate Gate Pass
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
