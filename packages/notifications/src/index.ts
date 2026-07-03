export interface NotificationAdapter {
  send(input: { recipientId: string; subject: string; body: string }): Promise<void>;
}

export class ConsoleNotificationAdapter implements NotificationAdapter {
  async send(input: { recipientId: string; subject: string; body: string }): Promise<void> {
    console.log("notification.local", input);
  }
}
