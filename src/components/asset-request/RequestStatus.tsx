import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { requestService } from "@/services/requestService";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";

interface RequestStatusProps {
  requestId?: string;
}

import { RequestHistory } from "./RequestHistory";
import { RequestComments } from "@/components/comments/RequestComments";

const RequestStatus = ({ requestId }: RequestStatusProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<any>(null);
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequestStatus = async () => {
      try {
        setLoading(true);
        const data = await requestService.getRequestById(requestId);
        setRequest(data);
        setApprovals(data.approvals);
      } catch (err) {
        console.error("Error fetching request:", err);
        setError("Failed to load request status");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestStatus();

    // Subscribe to request changes
    const requestChannel = supabase
      .channel(`request-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "asset_requests",
          filter: `id=eq.${requestId}`,
        },
        (payload) => {
          setRequest(payload.new);
        },
      )
      .subscribe();

    // Subscribe to approval changes
    const approvalsChannel = supabase
      .channel(`approvals-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "approvals",
          filter: `request_id=eq.${requestId}`,
        },
        async () => {
          // Refetch all approvals when any change occurs
          const { data: updatedRequest } = await supabase
            .from("asset_requests")
            .select("*, approvals(*)")
            .eq("id", requestId)
            .single();

          if (updatedRequest) {
            setApprovals(updatedRequest.approvals);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestChannel);
      supabase.removeChannel(approvalsChannel);
    };
  }, [requestId]);

  if (loading) {
    return (
      <Card className="p-6 bg-white">
        <div className="flex flex-col items-center justify-center h-[200px]">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">
            Loading request status...
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-white">
        <div className="text-center text-red-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card className="p-6 bg-white">
        <div className="text-center text-gray-500">
          <p>No request selected</p>
        </div>
      </Card>
    );
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <Card className="p-6 bg-white">
          <div>
            <h3 className="text-lg font-semibold mb-2">Request Status</h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(request.status)}
              <span className="font-medium">
                {getStatusBadge(request.status)}
              </span>
            </div>
          </div>
        </Card>

        <ApprovalFlow
          requestId={requestId}
          approvals={approvals}
          userRole={
            activeAccount?.username === request.department?.head_id
              ? "department_head"
              : "ict"
          }
          onApprovalUpdate={fetchRequestStatus}
        />
      </div>
      {requestId && (
        <>
          <RequestHistory requestId={requestId} />
          <RequestComments requestId={requestId} />
        </>
      )}
    </div>
  );
};

export default RequestStatus;
