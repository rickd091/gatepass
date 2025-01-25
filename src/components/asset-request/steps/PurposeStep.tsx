import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurposeStepProps {
  onNext?: () => void;
  onBack?: () => void;
  purpose?: string;
  justification?: string;
  category?: string;
  onPurposeChange?: (value: string) => void;
  onJustificationChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
}

const PurposeStep: React.FC<PurposeStepProps> = ({
  purpose = "",
  justification = "",
  category = "work",
  onPurposeChange = () => {},
  onJustificationChange = () => {},
  onCategoryChange = () => {},
}) => {
  return (
    <Card className="w-full p-6 bg-white">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Request Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disposal">Asset Disposal</SelectItem>
              <SelectItem value="transfer">Branch Transfer</SelectItem>
              <SelectItem value="fieldwork">Field Work</SelectItem>
              <SelectItem value="repair">
                External Repair/Maintenance
              </SelectItem>
              <SelectItem value="event">Event/Exhibition</SelectItem>
              <SelectItem value="other">Other Purpose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose</Label>
          <Textarea
            id="purpose"
            placeholder="Brief description of why you need this asset"
            value={purpose}
            onChange={(e) => onPurposeChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {category === "transfer" && (
          <div className="space-y-2">
            <Label htmlFor="destinationBranch">Destination Branch</Label>
            <Select onValueChange={(value) => onCategoryChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination branch" />
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
        )}

        <div className="space-y-2">
          <Label htmlFor="justification">Detailed Justification</Label>
          <Textarea
            id="justification"
            placeholder="Provide detailed justification for your request"
            value={justification}
            onChange={(e) => onJustificationChange(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
      </div>
    </Card>
  );
};

export default PurposeStep;
