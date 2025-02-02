export interface groupType {
  groupId: number;
  title: string;
  diseaseName: Record<string, string>;
  isPrivate: boolean;
  privatePassword: string | null;
  inviteCode: string;
  isHost: boolean;
  startDate: string;
  period: number;
  meetingTime: number;
  dayOfWeek: number;
  minMembers: number;
  maxMembers: number;
  totalMembers: number;
  groupStatus: number;
}
