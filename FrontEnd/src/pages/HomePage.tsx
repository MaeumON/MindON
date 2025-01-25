import axios from "axios";
import { useEffect } from "react";
const { VITE_API_BASE } = import.meta.env;

function HomePage() {
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(VITE_API_BASE + "/api/groups/list");
        console.log(response.data);
      } catch (err) {
        console.error("error");
      }
    };
    fetchGroups();
  }, []);
  return (
    <>
      <div className="text-3xl font-jamsilRegular">잠실 레귤러</div>
      <div className="text-3xl font-jamsilMedium">잠실 미디엄</div>
      <div className="text-3xl font-jamsilBold">잠실 볼드</div>
      <div className="text-3xl font-suite ">스위트</div>
      <div className="text-3xl font-suite font-bold">스위트 볼드</div>
    </>
  );
}

export default HomePage;
