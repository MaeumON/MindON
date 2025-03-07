export interface RequestData {
  keyword?: string;
  diseaseId?: number[];
  isHost?: boolean | null; // 진행자 여부 (true, false, null)
  startDate?: string | null; // 날짜 (YYYY-MM-DD 00-00-00)
  period?: number; // 기간 (1~8주)
  startTime?: number; // 시작 시간 (HH)
  endTime?: number; // 종료 시간 (HH)
  dayOfWeek?: number[]; // 요일 (1~7)
}

export interface Group {
  groupId: number;
  title: string;
  diseaseId: number;
  diseaseName: string;
  isPrivate: boolean;
  privatePassword?: string;
  inviteCode?: string;
  isHost: boolean;
  startDate: Date;
  period: number;
  meetingTime: number;
  dayOfWeek: number;
  minMember: number;
  maxMember: number;
  totalMember: number;
  groupStatus: number;
}

export interface ApiResponse {
  content: Group[];
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
}

export interface GroupDetail extends Group {
  registered: boolean;
  description: string;
  progressWeeks?: number;
  meetingStatus?: number;
  meetingId?: number;
}

export interface CreateRoomReqestType {
  title: string;
  diseaseId: number;
  isPrivate: boolean;
  privatePassword: string;
  isHost: boolean;
  startDate: string;
  period: number;
  meetingTime: number;
  dayOfWeek: number;
  minMember: number;
  maxMember: number;
  description: string;
}
