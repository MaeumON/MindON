import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Delight from "@/assets/images/feeling/feelingDelight.png";
import Happy from "@/assets/images/feeling/feelingHappy.png";
import Mad from "@/assets/images/feeling/feelingMad.png";
import Nervous from "@/assets/images/feeling/feelingNervous.png";
import Peace from "@/assets/images/feeling/feelingPeace.png";
import Proud from "@/assets/images/feeling/feelingProud.png";
import Sad from "@/assets/images/feeling/feelingSad.png";
import Tired from "@/assets/images/feeling/feelingTired.png";
import thinkingbear from "@/assets/images/thinkingbear.png";
import loudspeaker from "@/assets/icons/loudspeaker.png";
import chat from "@/assets/icons/chat.png";
import NoneEmotion from "@/assets/images/feeling/noneEmotion.png";

import useAuthStore from "@/stores/authStore";
import { useEffect, useState } from "react";
import { fetchReviews, ReviewType } from "@/apis/meetingDetail";

function MyDataDetail() {
  const { data } = useAuthStore();
  const username = data.userName || "사용자";

  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [emotionAvg, setEmotionAvg] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  // const [weekNum, setWeekNum] = useState<number>(1);

  // 리뷰 불러오고 안되면 로딩중
  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchReviews("1");
      if (data) {
        setReviews(data.data);
        setEmotionAvg(data.emotionAvg);
      }
      setLoading(false);
    };
    loadReviews();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col mt-20 justify-center text-cardTitle text-32px font-jamsilRegular text-center">
        로딩 중입니다! <br /> 조금만 기다려주세요!
      </div>
    );
  // 모임 감정 총평
  const emotionTitle = (() => {
    if (emotionAvg > 3) {
      return "훌륭함";
    } else if (emotionAvg === 3) {
      return "괜찮음";
    } else {
      return "차디참";
    }
  })();

  // 감정에 따른 이미지 매핑
  const emotionImages: { [key: number]: string } = {
    1: Delight,
    2: Happy,
    3: Proud,
    4: Peace,
    5: Sad,
    6: Tired,
    7: Nervous,
    8: Mad,
  };

  const getEmotionPosition = (emotion: number) => {
    if (emotion === 0) return "top-[62px]";
    if (emotion >= 5) return "top-[90px]"; // 부정
    if (emotion <= 3) return "top-[34px]"; // 긍정
    return "top-[62px]"; // 평온
  };

  return (
    <div>
      <Header title="마음 리포트" isicon={true} />
      <div className="p-[20px]">
        <div className="whitespace-nowrap flex flex-col items-center rounded-[8px] bg-white h-[220px]  shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)]  overflow-hidden px-4 py-6 ]">
          <div>
            <span className="text-cardTitle text-center font-jamsilMedium text-22px">치매환자 가족모임 자조모임</span>
            <span className="text-cardTitle font-jamsilRegular text-16px">
              {" "}
              후
              {/* 에 <br />
              참여하셨군요. */}
            </span>
          </div>
          <div className="text-cardTitle font-jamsilRegular text-16px whitespace-nowrap">
            {username}님의 기분은 <span className="text-orange100">{emotionTitle}</span>이었어요.
          </div>
          <div className="graphbox relative w-[280px] h-[100px] flex items-center justify-center mt-2 px-4">
            {/* 감정 꺾은선 그래프 */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="w-[0px] h-[80px] origin-top-left border border-[#eeeeee] absolute object-contain"
                style={{
                  left: `${index * 31 + 28}px`, // 0부터 6까지 수직선 위치
                  zIndex: 1,
                }}
              />
            ))}

            {/* 감정 이미지가 들어갈 컨테이너 (170px) */}
            <div className="absolute w-[300px] h-[150px] ">
              {/* 감정 이미지 */}
              {Array.from({ length: 8 }).map((_, index) => {
                const review = reviews[index] || { emotion: 0 }; // 리뷰가 없으면 기본값으로 "?" 설정
                const emotionImg = emotionImages[review.emotion] || NoneEmotion; // 기본값은 물음표로 설정
                return (
                  <div
                    key={index}
                    className={`absolute flex items-center justify-center ${getEmotionPosition(review.emotion)}`}
                    style={{
                      left: `${index * 31 + 26}px`, // 수직선에 맞게 배치
                      // top: getEmotionPosition(review.emotion), // 감정에 맞는 위치로 배치
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={emotionImg}
                      alt={`emotion-${review.emotion}`}
                      className="w-[28px] h-[28px] object-contain ${getEmotionPosition(review.emotion)}}" // 이미지 비율 유지
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* 인덱스 */}
        <div className="flex gap-1">
          {/* 활성화 된 버튼은 w-15 h-12 mt-8  */}
          <div className="w-15 h-12 mt-8 px-5 bg-[#f8d893] rounded-tl-xl rounded-tr-xl shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">1</div>
          </div>
          <div className="w-10 h-10 mt-10  bg-[#dddddd]/50 rounded-tl-lg rounded-tr-lg shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">2</div>
          </div>
          <div className="w-10 h-10 mt-10  bg-[#dddddd]/50 rounded-tl-lg rounded-tr-lg shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">3</div>
          </div>
          <div className="w-10 h-10 mt-10  bg-[#dddddd]/50 rounded-tl-lg rounded-tr-lg shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">4</div>
          </div>
          <div className="w-10 h-10 mt-10  bg-[#dddddd]/50 rounded-tl-lg rounded-tr-lg shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">5</div>
          </div>
          <div className="w-10 h-10 mt-10  bg-[#dddddd]/50 rounded-tl-lg rounded-tr-lg shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">6</div>
          </div>
          <div className="w-10 h-10 mt-10  bg-[#dddddd]/50 rounded-tl-lg rounded-tr-lg shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">7</div>
          </div>
          <div className="w-10 h-10 mt-10  bg-[#dddddd]/50 rounded-tl-lg rounded-tr-lg shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)] justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-2xl font-medium font-['The Jamsil']">8</div>
          </div>
        </div>
        {/* 내용부분 */}
        <div className="p-4 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)]">
          <div className="flex gap-2 mb-5">
            <div className="flex flex-col justify-end basis-2/5">
              <img src={thinkingbear} alt="" className="scale-x-[-1] w-[100px] h-[100px] object-contain" />
            </div>
            <div className="flex flex-col basis-3/5">
              <div className="font-jamsilMedium text-20px">온이의 한 마디</div>
              <div className="font-suite">
                혼자서 모든 것을 해결하지 않고 사람들과 함께 어려움을 나누는 것도 중요해요. 함께 힘내요 💪
              </div>
            </div>
          </div>
          <div className="px-2 py-4 bg-[#dde9ec] rounded-xl flex-col justify-center items-center">
            <div>
              <div className="flex gap-1 items-center">
                <img src={loudspeaker} alt="" className="w-[40px] h-[40px]" />
                <div className="whitespace-nowrap first-line:text-center-text-cardTitle text-16px sm:text-18px font-jamsilRegular">
                  3회차에는 이런 얘기를 했어요.
                </div>
              </div>
              <div className="flex justify-center py-3">
                <div className="p-4 w-[95%] bg-white rounded-lg">
                  <div className=" text-cardLongContent font-suite leading-normal">
                    1회차 모임은 하영님이 경청을 한 날이었어요. 많은 사람들이 따뜻해졌대요.
                    <br /> 트라우마에 대한 이야기를 털어놓고, 감정을 마주보는 시간을 가졌습니다.
                    <br /> 수연님의 질문은 “그 날을 떠올렸을때 가장 먼저 드는 감정은 무엇인가요?”였습니다. 수연님은
                    “아쉬움”이라고 대답했어요. 어머니를 더 이해하고 싶어해요.
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex gap-auto items-center">
                <img src={chat} alt="" className="w-[40px] h-[40px]" />
                <div className="whitespace-nowrap text-center-text-cardTitle text-16px sm:text-18px font-jamsilRegular">
                  이날 {username}님은 이만큼 말했어요.
                </div>
              </div>
              <div className="flex justify-center py-3">
                <div className="p-4 w-[95%] bg-white rounded-lg">발화량 차트</div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[50px]" />
      </div>
      <Footer />
    </div>
  );
}

export default MyDataDetail;
