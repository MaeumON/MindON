import Happy from "@assets/images/feelingHappy.png";
import Mad from "@assets/images/feelingMad.png";
import Nervous from "@assets/images/feelingNervous.png";
import Piece from "@assets/images/feelingPiece.png";
import Proud from "@assets/images/feelingProud.png";
import Sad from "@assets/images/feelingSad.png";
import Tired from "@assets/images/feelingTired.png";
import Delight from "@assets/images/feelingDelight.png";

type Emotion = {
  id: number;
  src: string;
  text: string;
  alt: string;
};

type EmotionList = Emotion[];

export const emotionList: EmotionList = [
  {
    id: 1,
    src: Delight,
    text: "기뻐요",
    alt: "기쁨표정",
  },
  {
    id: 2,
    src: Happy,
    text: "행복해요",
    alt: "행복표정",
  },
  {
    id: 3,
    src: Proud,
    text: "뿌듯해요",
    alt: "뿌듯표정",
  },

  {
    id: 4,
    src: Piece,
    text: "평온해요",
    alt: "평온표정",
  },

  {
    id: 5,
    src: Sad,
    text: "슬퍼요",
    alt: "슬픔표정",
  },

  {
    id: 6,
    src: Nervous,
    text: "불안해요",
    alt: "불안표정",
  },

  {
    id: 7,
    src: Tired,
    text: "피곤해요",
    alt: "피곤표정",
  },

  {
    id: 8,
    src: Mad,
    text: "화나요",
    alt: "화남표정",
  },
];
