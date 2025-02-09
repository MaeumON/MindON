import { ParticipantType } from "@/utils/openviduTypes";

export const OPENVIDU_SESSION = {
  sessionId: "1234",
  isHost: false,
};

//질문 발언 순서 데이터
export const QUESTION_SPEAKING_ORDER = [
  {
    no: 0,
    userId: 1,
    userName: "1번유저",
  },
  {
    no: 1,
    userId: 2,
    userName: "2번유저",
  },

  {
    no: 2,
    userId: 3,
    userName: "3번유저",
  },

  {
    no: 3,
    userId: 4,
    userName: "4번유저",
  },

  {
    no: 4,
    userId: 5,
    userName: "5번유저",
  },
];

export const PARTICIPANT_LIST: ParticipantType[] = [
  {
    userId: "1",
    userName: "1번유저",
  },
  {
    userId: "2",
    userName: "2번유저",
  },
  {
    userId: "3",
    userName: "3번유저",
  },
  {
    userId: "4",
    userName: "4번유저",
  },
  {
    userId: "5",
    userName: "5번유저",
  },
];
