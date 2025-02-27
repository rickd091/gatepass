import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { withErrorHandling } from "@/lib/utils/error-handler";
import { useMsal } from "@azure/msal-react";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  created_at: string;
  user_id: string;
  comment: string;
  user_role: string;
}

interface RequestCommentsProps {
  requestId: string;
}

export const RequestComments = ({ requestId }: RequestCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { accounts } = useMsal();
  const activeAccount = accounts[0];
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("request_comments")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true });

      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      fetchComments();

      // Subscribe to new comments
      const channel = supabase
        .channel(`comments-${requestId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "request_comments",
            filter: `request_id=eq.${requestId}`,
          },
          (payload) => {
            setComments((prev) => [...prev, payload.new as Comment]);
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [requestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeAccount) return;

    try {
      setSubmitting(true);
      await withErrorHandling(async () => {
        const { data, error } = await supabase.from("request_comments").insert({
          request_id: requestId,
          user_id: activeAccount.username,
          comment: newComment.trim(),
          user_role: "requester", // This should be dynamic based on user role
        });

        if (error) throw error;

        // Add the new comment to the list immediately
        if (data) {
          setComments((prev) => [...prev, data[0]]);
        }

        setNewComment("");
        toast({
          title: "Success",
          description: "Comment posted successfully",
        });
      }, "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      <div className="space-y-4">
        <div className="space-y-4 max-h-[300px] overflow-y-auto p-4 border rounded-lg">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 bg-gray-50 rounded-lg space-y-2 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.user_id}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {comment.user_role}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {format(new Date(comment.created_at), "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.comment}
              </p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <Spinner size="sm" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post Comment
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};
