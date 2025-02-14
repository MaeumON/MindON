import { getReportedUserApi, ReportedUser, unblockUserApi } from "@/apis/auth/adminApi";
import useLogoutApi from "@/apis/auth/logoutApi";
import Button from "@/components/common/Button";
import Header from "@/components/Layout/Header";
import { useEffect, useState } from "react";

const data = [
  {
    userId: "1",
    userName: "홍길동",
  },
  {
    userId: "2",
    userName: "이순신",
  },
  {
    userId: "3",
    userName: "강감찬",
  },
];

const Admin = () => {
  const onClickLogout = useLogoutApi();

  const [reportedUsers, setReportedUsers] = useState<ReportedUser[]>([]);

  function handleUnblockUser(userId: string) {
    unblockUserApi(userId)
      .then(() => {
        alert("성공적으로 처리되었습니다.");
      })
      .catch(() => {
        console.log("요청 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      });
  }

  async function getReportedUsers() {
    const response = await getReportedUserApi();
    setReportedUsers(response);
  }
  useEffect(() => {
    getReportedUsers();
  }, []);

  return (
    <>
      <Header title={"관리자 페이지"} isicon={false} />
      <div className="w-full min-h-screen px-[20px] mt-[30px] font-suite">
        <span className="ml-[5px] text-20px font-bold">신고 유저 목록</span>
        <ul className="h-[calc(100vh-160px-80px)] mt-[20px] flex flex-col gap-[20px] overflow-y-auto">
          {/* {reportedUsers.map((user) => (
            <li key={user.userId}>{user.userName}</li>
          ))} */}
          {data.map((user) => (
            <div
              key={user.userId}
              className="px-[20px] py-[10px] flex justify-between items-center bg-white rounded-[12px] shadow-lg"
            >
              <li className="w-[90%] font-bold text-18px">{user.userName}</li>
              <Button onClick={() => handleUnblockUser(user.userId)} text="정지 해제" type="GREEN" className="flex-1" />
            </div>
          ))}
        </ul>
        <button className="w-full h-[50px] " onClick={onClickLogout}>
          로그아웃
        </button>
      </div>
    </>
  );
};

export default Admin;
