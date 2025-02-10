export interface RequestData {
  keyword?: string;
  diseaseId: number[];
  isHost: boolean | null; // 진행자 여부 (true, false, null)
  startDate: Date; // 날짜 (YYYY-MM-DD 00-00-00)
  period: number; // 기간 (1~8주)
  startTime: Date; // 시작 시간 (HH)
  endTime: Date; // 종료 시간 (HH)
  dayOfWeek: number[]; // 요일 (1~7)
}

export interface Group {
  groupId: number;
  title: string;
  diseaseId: number;
  diseaseName: string;
  isPrivate: boolean;
  privatePassword?: string;
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

export interface GroupDetail extends Group {
  isRegister: boolean;
  description: string;
  progressWeeks?: number;
}
