import { supabase } from "@/lib/supabase";
import { notificationService } from "./notificationService";
import { format, addDays, isBefore } from "date-fns";

export const reminderService = {
  async checkAndSendReminders() {
    // Fetch active requests that are approaching return date
    const { data: activeRequests, error } = await supabase
      .from("asset_requests")
      .select(
        `
        *,
        assets (*),
        approvals (*)
      `,
      )
      .in("status", ["approved", "pending"])
      .order("end_date", { ascending: true });

    if (error) throw error;

    const now = new Date();

    for (const request of activeRequests || []) {
      const endDate = new Date(request.end_date);
      const threeDaysBefore = addDays(endDate, -3);
      const oneDayBefore = addDays(endDate, -1);

      // Check for return date reminders
      if (request.status === "approved") {
        if (
          isBefore(threeDaysBefore, now) &&
          !request.three_day_reminder_sent
        ) {
          await this.sendReturnReminder(request, 3);
          await supabase
            .from("asset_requests")
            .update({ three_day_reminder_sent: true })
            .eq("id", request.id);
        }

        if (isBefore(oneDayBefore, now) && !request.one_day_reminder_sent) {
          await this.sendReturnReminder(request, 1);
          await supabase
            .from("asset_requests")
            .update({ one_day_reminder_sent: true })
            .eq("id", request.id);
        }

        if (isBefore(endDate, now) && !request.overdue_reminder_sent) {
          await this.sendOverdueReminder(request);
          await supabase
            .from("asset_requests")
            .update({ overdue_reminder_sent: true })
            .eq("id", request.id);
        }
      }

      // Check for pending approval reminders
      if (request.status === "pending") {
        const pendingApprovals = request.approvals.filter(
          (approval) => approval.status === "pending",
        );

        for (const approval of pendingApprovals) {
          const approvalDate = new Date(approval.created_at);
          const twoDaysAfter = addDays(approvalDate, 2);

          if (isBefore(twoDaysAfter, now) && !approval.reminder_sent) {
            await this.sendApprovalReminder(request, approval);
            await supabase
              .from("approvals")
              .update({ reminder_sent: true })
              .eq("id", approval.id);
          }
        }
      }
    }
  },

  async sendReturnReminder(request: any, days: number) {
    await notificationService.createNotification({
      user_id: request.requester_id,
      title: `Asset Return Reminder`,
      message: `${request.assets.name} is due for return in ${days} day${days > 1 ? "s" : ""}. Return date: ${format(new Date(request.end_date), "MMM d, yyyy")}`,
      type: "system",
      link: `/requests/${request.id}`,
    });
  },

  async sendOverdueReminder(request: any) {
    await notificationService.createNotification({
      user_id: request.requester_id,
      title: `Asset Return Overdue`,
      message: `${request.assets.name} was due for return on ${format(new Date(request.end_date), "MMM d, yyyy")}. Please return it immediately.`,
      type: "system",
      link: `/requests/${request.id}`,
    });
  },

  async sendApprovalReminder(request: any, approval: any) {
    await notificationService.createNotification({
      user_id: approval.approver_id,
      title: `Pending Approval Reminder`,
      message: `A request for ${request.assets.name} is awaiting your approval for over 48 hours.`,
      type: "approval",
      link: `/approvals/${request.id}`,
    });
  },
};
