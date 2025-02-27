import { reminderService } from "@/services/reminderService";

// Check for reminders every 30 minutes
const REMINDER_INTERVAL = 30 * 60 * 1000;

export function startReminderWorker() {
  // Initial check
  reminderService.checkAndSendReminders();

  // Set up periodic checks
  setInterval(() => {
    reminderService.checkAndSendReminders();
  }, REMINDER_INTERVAL);
}
