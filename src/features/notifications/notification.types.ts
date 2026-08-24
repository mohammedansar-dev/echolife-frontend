export type NotificationType =
  | "memory"
  | "reflection"
  | "security"
  | "capsule"
  | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}
