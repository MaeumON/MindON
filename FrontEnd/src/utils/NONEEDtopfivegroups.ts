export interface topfivegroups {
  groupId: number;
  title: string;
  diseaseId: number;
  diseaseName: string;
  isPrivate: boolean;
  privatePassword: string;
  inviteCode: string;
  isHost: boolean;
  startDate: Date;
  period: number;
  meetingTime: number;
  dayOfWeek: number;
  minMembers: number;
  maxiMembers: number;
  totalMembers: number;
  groupStatus: number;
}
