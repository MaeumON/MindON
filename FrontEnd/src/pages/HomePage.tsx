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
  return <div>홈페이지</div>;
}

export default HomePage;
