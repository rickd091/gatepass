import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck } from "lucide-react";

interface SecurityVerificationStepProps {
  onBack?: () => void;
  onSubmit?: () => void;
  data?: {
    floorGuardName?: string;
    floorGuardSignature?: string;
    gateGuardName?: string;
    gateGuardSignature?: string;
  };
  onChange?: (data: any) => void;
}

const SecurityVerificationStep = ({
  onBack = () => {},
  onSubmit = () => {},
  data = {
    floorGuardName: "",
    floorGuardSignature: "",
    gateGuardName: "",
    gateGuardSignature: "",
  },
  onChange = () => {},
}: SecurityVerificationStepProps) => {
  return (
    <Card className="p-6 bg-white w-full max-w-[700px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Security Verification</h2>
          <p className="text-gray-500">
            Two-level security verification required for asset movement outside
            KMA premises
          </p>
          <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Note: For branch transfers, both origin and destination security
              personnel must verify the asset movement. For disposals,
              additional verification from the Asset Disposal Committee is
              required.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Floor Security Guard</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="floorGuardName">Guard Name</Label>
                <Input
                  id="floorGuardName"
                  placeholder="Enter floor security guard name"
                  value={data.floorGuardName}
                  onChange={(e) =>
                    onChange({ ...data, floorGuardName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorGuardSignature">Signature/Stamp</Label>
                <Input
                  id="floorGuardSignature"
                  placeholder="Enter signature or stamp ID"
                  value={data.floorGuardSignature}
                  onChange={(e) =>
                    onChange({ ...data, floorGuardSignature: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Gate Security Guard</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gateGuardName">Guard Name</Label>
                <Input
                  id="gateGuardName"
                  placeholder="Enter gate security guard name"
                  value={data.gateGuardName}
                  onChange={(e) =>
                    onChange({ ...data, gateGuardName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gateGuardSignature">Signature/Stamp</Label>
                <Input
                  id="gateGuardSignature"
                  placeholder="Enter signature or stamp ID"
                  value={data.gateGuardSignature}
                  onChange={(e) =>
                    onChange({ ...data, gateGuardSignature: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {data.purpose?.category === "disposal" && (
          <div className="p-4 border rounded-lg space-y-4 mt-6">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold">
                Asset Disposal Committee
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disposalApprover">Committee Member Name</Label>
                <Input
                  id="disposalApprover"
                  placeholder="Enter committee member name"
                  value={data.disposalApprover}
                  onChange={(e) =>
                    onChange({ ...data, disposalApprover: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disposalApprovalRef">Approval Reference</Label>
                <Input
                  id="disposalApprovalRef"
                  placeholder="Enter disposal approval reference number"
                  value={data.disposalApprovalRef}
                  onChange={(e) =>
                    onChange({ ...data, disposalApprovalRef: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete Verification
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SecurityVerificationStep;
