import React from "react";
import { useMsal } from "@azure/msal-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AssetDetailsStepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  data?: {
    requesterType: string;
    requesterName: string;
    staffNumber?: string;
    userId?: string;
    location?: string;
    organization?: string;
    authorizationDoc?: File;
    branchOffice: string;
    assetType: string;
    assetName: string;
    assetModel: string;
    serialNumber: string;
    tagNumber: string;
    specifications: string;
    condition: string;
  };
  onChange?: (data: any) => void;
}

const AssetDetailsStep = ({
  onNext = () => {},
  onPrevious = () => {},
  data = {
    requesterType: "staff",
    requesterName: "",
    staffNumber: "",
    userId: "",
    location: "",
    organization: "",
    authorizationDoc: undefined,
    branchOffice: "headquarters",
    assetType: "",
    assetName: "",
    assetModel: "",
    serialNumber: "",
    tagNumber: "",
    specifications: "",
    condition: "good",
  },
  onChange = () => {},
}: AssetDetailsStepProps) => {
  const { accounts } = useMsal();
  const activeAccount = accounts[0];

  // Update data with AD info when account changes
  React.useEffect(() => {
    if (activeAccount && data.requesterType === "staff") {
      onChange({
        ...data,
        requesterName: activeAccount.name || "",
        staffNumber: activeAccount.username || "",
      });
    }
  }, [activeAccount, data.requesterType]);

  return (
    <Card className="p-6 bg-white w-full max-w-[700px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="requesterType">Requester Type</Label>
          <Select
            value={data.requesterType}
            onValueChange={(value) =>
              onChange({ ...data, requesterType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select requester type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="non-staff">Non-Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requesterName">Requester Name</Label>
          {data.requesterType === "staff" ? (
            <Input
              id="requesterName"
              value={data.requesterName}
              readOnly
              className="bg-gray-50"
            />
          ) : (
            <Input
              id="requesterName"
              placeholder="Enter your full name"
              value={data.requesterName}
              onChange={(e) =>
                onChange({ ...data, requesterName: e.target.value })
              }
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="branchOffice">Branch Office</Label>
          <Select
            value={data.branchOffice}
            onValueChange={(value) =>
              onChange({ ...data, branchOffice: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch office" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="headquarters">
                Headquarters (Mombasa)
              </SelectItem>
              <SelectItem value="lamu">Lamu Office</SelectItem>
              <SelectItem value="lodwar">Lodwar Office</SelectItem>
              <SelectItem value="kisumu">Kisumu Office</SelectItem>
              <SelectItem value="naivasha">Naivasha Office</SelectItem>
              <SelectItem value="kpa">KPA Office</SelectItem>
              <SelectItem value="nakuru">Nakuru Office</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.requesterType === "staff" ? (
          <div className="space-y-2">
            <Label htmlFor="staffNumber">Staff Number</Label>
            <Input
              id="staffNumber"
              value={data.staffNumber}
              readOnly
              className="bg-gray-50"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="Enter user ID"
                value={data.userId}
                onChange={(e) => onChange({ ...data, userId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={data.location}
                onChange={(e) =>
                  onChange({ ...data, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="Enter organization"
                value={data.organization}
                onChange={(e) =>
                  onChange({ ...data, organization: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorizationDoc">Authorization Document</Label>
              <Input
                id="authorizationDoc"
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={(e) =>
                  onChange({
                    ...data,
                    authorizationDoc: e.target.files?.[0],
                  })
                }
              />
              <p className="text-sm text-gray-500">
                Please upload authorization letter or relevant documentation
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="assetType">Asset Type</Label>
          <Select
            defaultValue={data.assetType}
            onValueChange={(value) => onChange({ ...data, assetType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ict-equipment">ICT Equipment</SelectItem>
              <SelectItem value="office-equipment">Office Equipment</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="marine-equipment">Marine Equipment</SelectItem>
              <SelectItem value="safety-equipment">Safety Equipment</SelectItem>
              <SelectItem value="tools">Tools & Equipment</SelectItem>
              <SelectItem value="other">Other Assets</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetName">Asset Name</Label>
          <Input
            id="assetName"
            placeholder="Enter asset name"
            value={data.assetName}
            onChange={(e) => onChange({ ...data, assetName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetModel">Asset Model</Label>
          <Input
            id="assetModel"
            placeholder="Enter asset model"
            value={data.assetModel}
            onChange={(e) => onChange({ ...data, assetModel: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            placeholder="Enter serial number"
            value={data.serialNumber}
            onChange={(e) =>
              onChange({ ...data, serialNumber: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagNumber">Tag Number</Label>
          <Input
            id="tagNumber"
            placeholder="Enter tag number"
            value={data.tagNumber}
            onChange={(e) => onChange({ ...data, tagNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specifications">Specifications</Label>
          <Textarea
            id="specifications"
            placeholder="Enter asset specifications"
            value={data.specifications}
            onChange={(e) =>
              onChange({ ...data, specifications: e.target.value })
            }
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Asset Condition Photos</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frontPhoto" className="text-sm text-gray-500">
                Front View
              </Label>
              <Input
                id="frontPhoto"
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={(e) =>
                  onChange({
                    ...data,
                    frontPhoto: e.target.files?.[0],
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="backPhoto" className="text-sm text-gray-500">
                Back View
              </Label>
              <Input
                id="backPhoto"
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={(e) =>
                  onChange({
                    ...data,
                    backPhoto: e.target.files?.[0],
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Asset Condition</Label>
          <Select
            defaultValue={data.condition}
            onValueChange={(value) => onChange({ ...data, condition: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default AssetDetailsStep;
