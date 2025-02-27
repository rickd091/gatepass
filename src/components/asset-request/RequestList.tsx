import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { requestService } from "@/services/requestService";
import { format } from "date-fns";
import { useMsal } from "@azure/msal-react";
import { supabase } from "@/lib/supabase/client";
import { withErrorHandling } from "@/lib/utils/error-handler";
import { Clock, CheckCircle2, XCircle, AlertCircle, Copy } from "lucide-react";

const RequestList = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    assetType: "",
  });

  const [assetTypes, setAssetTypes] = useState<string[]>([]);

  // Get unique asset types
  useEffect(() => {
    const types = [...new Set(requests.map((req) => req.assets?.type))].filter(
      Boolean,
    );
    setAssetTypes(types);
  }, [requests]);
  const { accounts } = useMsal();
  const activeAccount = accounts[0];
  const { toast } = useToast();

  const handleCancelRequest = async (requestId: string) => {
    try {
      const request = requests.find((r) => r.id === requestId);
      if (!request) return;

      if (request.status !== "pending") {
        toast({
          title: "Cannot Cancel Request",
          description: "Only pending requests can be cancelled.",
          variant: "destructive",
        });
        return;
      }

      await requestService.cancelRequest(requestId);

      toast({
        title: "Request Cancelled",
        description: "Your request has been cancelled successfully.",
      });

      // Update the local state immediately
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "cancelled" } : r,
        ),
      );

      // Refresh the list to get the latest data
      await fetchRequests();
    } catch (err) {
      console.error("Error cancelling request:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to cancel request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await withErrorHandling(async () => {
        const { data } = await supabase
          .from("asset_requests")
          .select(
            `
              *,
              assets (*),
              approvals (*),
              departments (*),
              branches (*)
            `,
          )
          .eq("requester_id", activeAccount?.username)
          .order("created_at", { ascending: false });
        return data;
      }, "Failed to fetch requests");
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to requests
  useEffect(() => {
    let filtered = [...requests];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.assets?.name?.toLowerCase().includes(searchLower) ||
          request.assets?.type?.toLowerCase().includes(searchLower) ||
          request.purpose?.toLowerCase().includes(searchLower),
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(
        (request) => request.status === filters.status,
      );
    }

    // Apply date range filter
    if (filters.startDate) {
      filtered = filtered.filter(
        (request) => new Date(request.start_date) >= filters.startDate!,
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (request) => new Date(request.end_date) <= filters.endDate!,
      );
    }

    // Apply asset type filter
    if (filters.assetType) {
      filtered = filtered.filter(
        (request) => request.assets?.type === filters.assetType,
      );
    }

    setFilteredRequests(filtered);
  }, [requests, filters]);

  useEffect(() => {
    if (activeAccount?.username) {
      fetchRequests();

      // Subscribe to changes
      const channel = supabase
        .channel("request-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "asset_requests",
            filter: `requester_id=eq.${activeAccount.username}`,
          },
          () => {
            fetchRequests();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeAccount?.username]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <XCircle className="w-4 h-4 mr-1" />
            Cancelled
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <AlertCircle className="w-4 h-4 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[200px]">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">Loading requests...</p>
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

  if (requests.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>No requests found</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Requests</h2>
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Search</Label>
            <Input
              placeholder="Search by asset name or purpose"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Asset Type</Label>
            <Select
              value={filters.assetType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, assetType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {assetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!filters.startDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      format(filters.startDate, "PPP")
                    ) : (
                      <span>Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) =>
                      setFilters((prev) => ({ ...prev, startDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!filters.endDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? (
                      format(filters.endDate, "PPP")
                    ) : (
                      <span>End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) =>
                      setFilters((prev) => ({ ...prev, endDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {request.assets?.name || "Unknown Asset"}
                  </h3>
                  {getStatusBadge(request.status)}
                </div>
                <p className="text-sm text-gray-500">
                  {request.purpose_category} - {request.purpose}
                </p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>
                    From: {format(new Date(request.start_date), "MMM d, yyyy")}
                  </span>
                  <span>
                    To: {format(new Date(request.end_date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    requestService
                      .duplicateRequest(request.id)
                      .then(() => {
                        toast({
                          title: "Request Duplicated",
                          description:
                            "A new request has been created with the same details.",
                        });
                      })
                      .catch((error) => {
                        console.error("Error duplicating request:", error);
                        toast({
                          title: "Error",
                          description: "Failed to duplicate request",
                          variant: "destructive",
                        });
                      });
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {format(new Date(request.created_at), "MMM d, yyyy h:mm a")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {request.departments?.name || "Unknown Department"}
                  </p>
                </div>
                {request.status === "pending" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cancel Request
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Request</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this request? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, keep it</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelRequest(request.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, cancel request
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RequestList;
