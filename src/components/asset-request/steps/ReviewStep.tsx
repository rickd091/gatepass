import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, AlertCircle, Shield, ShieldCheck } from "lucide-react";

interface ReviewStepProps {
  assetDetails?: {
    name: string;
    id: string;
    type: string;
    model: string;
    serialNumber: string;
    tagNumber: string;
    condition: string;
    specifications: string;
  };
  requesterInfo?: {
    type: string;
    requesterName: string;
    staffNumber?: string;
    userId?: string;
    location?: string;
    organization?: string;
  };
  purpose?: {
    category: string;
    purpose: string;
    justification: string;
  };
  duration?: {
    startDate: Date;
    endDate: Date;
    notes?: string;
  };
  security?: {
    floorGuardName?: string;
    floorGuardSignature?: string;
    gateGuardName?: string;
    gateGuardSignature?: string;
  };
  onSubmit?: () => void;
  onBack?: () => void;
}

const ReviewStep = ({
  assetDetails = {
    name: "Laptop XPS 13",
    id: "AST-001",
    type: "Laptop",
    model: "Dell XPS 13",
    serialNumber: "SN123456",
    tagNumber: "KMA-001",
    condition: "Good",
    specifications: "",
  },
  requesterInfo = {
    type: "staff",
    requesterName: "John Doe",
    staffNumber: "KMA123",
  },
  purpose = {
    category: "fieldwork",
    purpose: "Field inspection equipment",
    justification: "Required for port inspection",
  },
  duration = {
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notes: "",
  },
  security = {
    floorGuardName: "",
    floorGuardSignature: "",
    gateGuardName: "",
    gateGuardSignature: "",
  },
  onSubmit = () => {},
  onBack = () => {},
}: ReviewStepProps) => {
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
          <h3 className="text-lg font-semibold mb-3">Requester Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Requester Name</p>
              <p className="font-medium">{requesterInfo.requesterName}</p>
            </div>
            <div>
              <p className="text-gray-500">Requester Type</p>
              <p className="font-medium">
                {requesterInfo.type === "staff" ? "Staff" : "Non-Staff"}
              </p>
            </div>
            {requesterInfo.type === "staff" ? (
              <div>
                <p className="text-gray-500">Staff Number</p>
                <p className="font-medium">{requesterInfo.staffNumber}</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-gray-500">User ID</p>
                  <p className="font-medium">{requesterInfo.userId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{requesterInfo.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Organization</p>
                  <p className="font-medium">{requesterInfo.organization}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Asset Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Asset Name</p>
              <p className="font-medium">{assetDetails.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Asset Type</p>
              <p className="font-medium">{assetDetails.type}</p>
            </div>
            <div>
              <p className="text-gray-500">Model</p>
              <p className="font-medium">{assetDetails.model}</p>
            </div>
            <div>
              <p className="text-gray-500">Serial Number</p>
              <p className="font-medium">{assetDetails.serialNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Tag Number</p>
              <p className="font-medium">{assetDetails.tagNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Condition</p>
              <p className="font-medium">{assetDetails.condition}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Purpose & Duration</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium capitalize">{purpose.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Purpose</p>
              <p className="font-medium">{purpose.purpose}</p>
            </div>
            <div>
              <p className="text-gray-500">Justification</p>
              <p className="font-medium">{purpose.justification}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Start Date</p>
                <p className="font-medium">
                  {duration.startDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Return Date</p>
                <p className="font-medium">
                  {duration.endDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Security Verification</h3>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium">Floor Security</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Guard Name</p>
                  <p className="font-medium">
                    {security.floorGuardName || "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Signature/Stamp</p>
                  <p className="font-medium">
                    {security.floorGuardSignature || "Pending"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <h4 className="font-medium">Gate Security</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Guard Name</p>
                  <p className="font-medium">
                    {security.gateGuardName || "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Signature/Stamp</p>
                  <p className="font-medium">
                    {security.gateGuardSignature || "Pending"}
                  </p>
                </div>
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
            required. The requester is responsible for the asset's safety and
            timely return (if applicable).
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-2" />
          Generate Gate Pass
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
