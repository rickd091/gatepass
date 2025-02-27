import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { approvalService } from "@/services/approvalService";
import { useToast } from "@/components/ui/use-toast";

interface ApprovalFlowProps {
  requestId: string;
  approvals: Array<{
    id: string;
    status: string;
    approver_role: string;
    comments?: string;
    created_at: string;
  }>;
  userRole?: string;
  onApprovalUpdate?: () => void;
}

export const ApprovalFlow = ({
  requestId,
  approvals,
  userRole,
  onApprovalUpdate = () => {},
}: ApprovalFlowProps) => {
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleApproval = async (approved: boolean) => {
    try {
      setLoading(true);
      const approval = approvals.find((a) => a.approver_role === userRole);
      if (!approval) return;

      await approvalService.updateApproval(approval.id, {
        status: approved ? "approved" : "rejected",
        comments: comment,
      });

      toast({
        title: approved ? "Request Approved" : "Request Rejected",
        description: "The approval status has been updated successfully.",
      });

      onApprovalUpdate();
    } catch (error) {
      console.error("Error updating approval:", error);
      toast({
        title: "Error",
        description: "Failed to update approval status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const currentUserApproval = approvals.find(
    (a) => a.approver_role === userRole,
  );
  const canApprove = currentUserApproval?.status === "pending";

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Approval Flow</h3>
      <div className="space-y-4">
        {approvals.map((approval) => (
          <div
            key={approval.id}
            className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(approval.status)}
                <div>
                  <p className="font-medium">
                    {approval.approver_role === "department_head"
                      ? "Department Head"
                      : "ICT Officer"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(approval.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(approval.status)}
            </div>

            {approval.comments && (
              <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded">
                "{approval.comments}"
              </p>
            )}

            {approval.approver_role === userRole && canApprove && (
              <div className="space-y-3 pt-2">
                <Textarea
                  placeholder="Add your comments (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleApproval(false)}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproval(true)}
                    disabled={loading}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
