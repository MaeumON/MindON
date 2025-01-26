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
        console.error("error", err);
      }
    };
    fetchGroups();
  }, []);
  return (
    <div className="container m-auto sm:max-w-360 sm:bg-yellow100 md:max-w-412 md:bg-green100 ">
      <div className="text-3xl font-jamsilRegular text-cardTitle">잠실 레귤러 & Card Title</div>
      <div className="text-3xl font-jamsilMedium text-cardLongContent">잠실 미디엄 & Card Long Content</div>
      <div className="text-3xl font-jamsilBold text-cardContent">잠실 볼드 & Card Content</div>
      <div className="text-3xl font-suite text-cardSubcontent"> 스위트 & Card Subcontent</div>
      <div className="text-3xl font-suite font-bold">스위트 볼드</div>

      <div className="bg-yellow100 w-20 h-20 text-center">Primary Yellow</div>
      <div className="bg-green100 w-20 h-20 text-center">Primary Green</div>
      <div className="bg-orange100 w-20 h-20 text-center">Primary Orange</div>
      <div className="bg-skyBlue100 w-20 h-20 text-center">Primary Sky Blue</div>
      <div className="bg-red100 w-20 h-20 text-center">Primary Red</div>
      <div className="bg-offWhite w-20 h-20 text-center">Off White</div>
    </div>
  );
}

export default HomePage;
