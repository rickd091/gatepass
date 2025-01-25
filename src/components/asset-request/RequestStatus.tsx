import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface RequestStatusProps {
  status?: "pending" | "approved" | "rejected" | "in-review";
  requestId?: string;
  approvalSteps?: {
    step: string;
    status: "pending" | "approved" | "rejected" | "in-progress";
    approver?: string;
    date?: string;
  }[];
}

const RequestStatus = ({
  status = "pending",
  requestId = "REQ-001",
  approvalSteps = [
    {
      step: "Department Head Review",
      status: "approved",
      approver: "John Doe",
      date: "2024-03-20",
    },
    {
      step: "Asset Disposal Committee",
      status: "pending",
      approver: "",
      date: "",
    },
    {
      step: "Asset Custodian Review",
      status: "in-progress",
      approver: "Jane Smith",
    },
    {
      step: "Floor Security Check",
      status: "pending",
    },
    {
      step: "Gate Security Check",
      status: "pending",
    },
  ],
}: RequestStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in-progress":
      case "in-review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "in-progress":
      case "in-review":
      case "pending":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    const completed = approvalSteps.filter(
      (step) => step.status === "approved",
    ).length;
    return (completed / approvalSteps.length) * 100;
  };

  return (
    <Card className="p-6 bg-white w-full max-w-[300px]">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Request Status</h3>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">#{requestId}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Approval Progress</span>
            <span className="text-sm font-medium">
              {Math.round(calculateProgress())}%
            </span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Approval Steps</h4>
          {approvalSteps.map((step, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {getStatusIcon(step.status)}
                  <div>
                    <p className="text-sm font-medium">{step.step}</p>
                    {step.approver && (
                      <p className="text-xs text-gray-500">{step.approver}</p>
                    )}
                  </div>
                </div>
                {step.date && (
                  <span className="text-xs text-gray-500">{step.date}</span>
                )}
              </div>
              {index < approvalSteps.length - 1 && (
                <div className="ml-2 pl-2 border-l-2 border-gray-200 h-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RequestStatus;
