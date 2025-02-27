import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { withErrorHandling } from "@/lib/utils/error-handler";

interface RequestHistoryProps {
  requestId: string;
}

interface HistoryEntry {
  id: string;
  type: "status" | "approval" | "security";
  timestamp: string;
  title: string;
  description: string;
  status: string;
  actor?: string;
  comments?: string;
}

export const RequestHistory = ({ requestId }: RequestHistoryProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const [requestData, approvalsData, securityData] = await Promise.all([
        withErrorHandling(async () => {
          const { data } = await supabase
            .from("asset_requests")
            .select("*, assets(*), departments(*), branches(*)")
            .eq("id", requestId)
            .single();
          return data;
        }),
        withErrorHandling(async () => {
          const { data } = await supabase
            .from("approvals")
            .select("*")
            .eq("request_id", requestId)
            .order("created_at", { ascending: true });
          return data;
        }),
        withErrorHandling(async () => {
          const { data } = await supabase
            .from("security_verifications")
            .select("*")
            .eq("request_id", requestId)
            .order("created_at", { ascending: true });
          return data;
        }),
      ]);

      const historyEntries: HistoryEntry[] = [
        {
          id: requestData.id,
          type: "status",
          timestamp: requestData.created_at,
          title: "Request Created",
          description: `Request for ${requestData.assets.name} submitted`,
          status: "created",
        },
        ...approvalsData.map((approval) => ({
          id: approval.id,
          type: "approval",
          timestamp: approval.created_at,
          title: `${approval.approver_role.replace("_", " ").toUpperCase()} Review`,
          description:
            approval.status === "pending"
              ? "Awaiting approval"
              : `${approval.status === "approved" ? "Approved" : "Rejected"} by ${approval.approver_role}`,
          status: approval.status,
          actor: approval.approver_id,
          comments: approval.comments,
        })),
        ...securityData.map((verification) => ({
          id: verification.id,
          type: "security",
          timestamp: verification.created_at,
          title: `${verification.verification_type === "outgoing" ? "Exit" : "Return"} Verification`,
          description: `Verified by ${verification.floor_guard_name} (Floor) and ${verification.gate_guard_name} (Gate)`,
          status: verification.status,
        })),
      ];

      // Sort by timestamp
      historyEntries.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setHistory(historyEntries);
    } catch (err) {
      console.error("Error fetching request history:", err);
      setError("Failed to load request history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchHistory();

      // Subscribe to changes
      const approvalChannel = supabase
        .channel(`approval-history-${requestId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "approvals",
            filter: `request_id=eq.${requestId}`,
          },
          () => fetchHistory(),
        )
        .subscribe();

      const securityChannel = supabase
        .channel(`security-history-${requestId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "security_verifications",
            filter: `request_id=eq.${requestId}`,
          },
          () => fetchHistory(),
        )
        .subscribe();

      return () => {
        supabase.removeChannel(approvalChannel);
        supabase.removeChannel(securityChannel);
      };
    }
  }, [requestId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "created":
        return <Badge className="bg-blue-100 text-blue-800">Created</Badge>;
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[200px]">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">Loading history...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Request History</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-8 relative">
          {history.map((entry, index) => (
            <div
              key={`${entry.type}-${entry.id}`}
              className={`flex items-start space-x-6 ${index === history.length - 1 ? "" : "pb-8"}`}
            >
              <div className="flex-none relative">
                <div className="h-9 w-9 rounded-full border-2 flex items-center justify-center bg-white relative z-10">
                  {getStatusIcon(entry.status)}
                </div>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {entry.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {format(
                        new Date(entry.timestamp),
                        "MMM d, yyyy 'at' h:mm a",
                      )}
                    </p>
                  </div>
                  {getStatusBadge(entry.status)}
                </div>
                <p className="text-gray-600 mt-2">{entry.description}</p>
                {entry.comments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                    <p className="text-sm text-gray-600 italic">
                      "{entry.comments}"
                    </p>
                    {entry.actor && (
                      <p className="text-xs text-gray-500 mt-1">
                        - {entry.actor}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
