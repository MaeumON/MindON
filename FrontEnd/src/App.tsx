import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PreJoin from "@pages/openvidu/PreJoin";
import Welcome from "@pages/Welcome";
import Login from "@pages/auth/Login";
import SignUp from "@pages/auth/SignUp";
import FindId from "@pages/auth/FindId";
import FindPwd from "@pages/auth/FindPwd";
import Main from "@pages/Main";
import MyData from "@/pages/MyData";
import MyDataDetail from "./pages/MyDataDetail";
import GroupsList from "@pages/group/GroupsList";
import GroupDetail from "@pages/group/GroupDetail";
import MyDataList from "@pages/MyDataList";
import MyPage from "@pages/mypage/MyPage";
import CreateGroup from "./pages/group/CreateGroup";
import MypageDetail from "@pages/mypage/MypageDetail";
import MyPageGroupList from "@pages/mypage/MyPageGroupList";
import UpdateUser from "./pages/auth/UpdateUser";
import { ProtectRouter } from "./ProtectRouter";
import Admin from "./pages/admin/Admin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 로그인 되지 않았을 때 접근 가능한 페이지 */}
        {/* auth */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpwd" element={<FindPwd />} />

        {/* 로그인 됐을 때만 접근 가능한 페이지 */}
        <Route element={<ProtectRouter />}>
          <Route path="/main" element={<Main />} />
          <Route path="/admin" element={<Admin />} />

          {/* openvidu */}
          <Route path="/prejoin/:groupId/:groupName" element={<PreJoin />} />

          {/* openvidu */}
          <Route path="/prejoin/:groupId/:groupName" element={<PreJoin />} />
          {/* group */}
          <Route path="/groupslist" element={<GroupsList />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />

          {/* mydata */}
          <Route path="/mydata" element={<MyData />} />
          <Route path="/mydata/grouplist/:groupStatus" element={<MyDataList />} />
          <Route
            path="/mydata/grouplist"
            element={<div className="font-jamsilMedium text-32px flex justify-center my-10">잘못된 주소입니다!</div>}
          />
          <Route path="/mydata/:groupId" element={<MyDataDetail />} />

          {/* mypage */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/creategroup" element={<CreateGroup />} />
          <Route path="/mypage/grouplist/:groupStatus" element={<MyPageGroupList />} />
          <Route path="/mypage/:groupId" element={<MypageDetail />} />
          <Route path="/mypage/updateuser" element={<UpdateUser />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
