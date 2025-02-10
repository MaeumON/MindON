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

import useAuthStore from "@/stores/authStore";
import { useEffect, useState } from "react";
import { fetchReviews, ReviewType } from "@/apis/meetingDetail";

function MyDataDetail() {
  const { data } = useAuthStore();
  const username = data.userName || "사용자";

  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [emotionAvg, setEmotionAvg] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

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
      <div className="text-cardTitle text-36px font-jamsilRegular text-center">
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
      return "차디차다";
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

  const NoneEmotion = "?";

  const getEmotionPosition = (emotion: number) => {
    if (emotion >= 5) return "top-[120px]"; // 부정
    if (emotion === 4) return "top-[80px]"; // 평온
    return "top-[40px]"; // 좋음
  };

  return (
    <div>
      <Header title="마이데이터" isicon={true} />
      <div className="p-[20px]">
        <div className=" flex flex-col items-center rounded-[8px] bg-white h-[265px]  shadow-[0px_1px_3px_0px_rgba(221,221,221,1.00)]  overflow-hidden p-4 ]">
          <div>
            <span className="text-cardTitle text-center font-jamsilMedium text-22px">치매환자 가족모임</span>
            <span className="text-cardTitle font-jamsilRegular text-16px">에 참여하셨군요.</span>
          </div>
          <div className="text-cardTitle font-jamsilRegular text-16px">
            {username}님의 기분은 <span className="text-orange100">{emotionTitle}</span>이었어요.
          </div>
          {/* ✅ 감정 꺾은선 그래프 */}
          <div className="relative w-full h-[150px] flex items-center justify-start mt-4 px-4">
            <div className="rotate-90 border border-[#dddddd] absolute top-0 left-[50%] h-full z-10" />{" "}
            {reviews.map((review, index) => {
              const emotionImg = emotionImages[review.emotion] || NoneEmotion; // 기본값은 물음표로 설정
              return (
                <img
                  key={review.meetingId}
                  src={emotionImg}
                  alt={`emotion-${review.emotion}`}
                  className={`w-[33px] h-[33px] absolute ${getEmotionPosition(review.emotion)}`}
                  style={{ left: `${index * 50}px` }} // 왼쪽에서 오른쪽으로 나열
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyDataDetail;
