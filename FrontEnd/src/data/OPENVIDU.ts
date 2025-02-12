import { ParticipantType } from "@/utils/openvidu/openviduTypes";

export const OPENVIDU_SESSION = {
  sessionId: "1234",
  isHost: false,
};

//질문 발언 순서 데이터
export const QUESTION_SPEAKING_ORDER = [
  {
    no: 0,
    userId: "user01",
    userName: "1번유저",
  },
  {
    no: 1,
    userId: "user02",
    userName: "2번유저",
  },

  {
    no: 2,
    userId: "user03",
    userName: "3번유저",
  },
];

export const PARTICIPANT_LIST: ParticipantType[] = [
  {
    userId: "user01",
    userName: "1번유저",
  },
  {
    userId: "user02",
    userName: "2번유저",
  },
  {
    userId: "user03",
    userName: "3번유저",
  },
];
