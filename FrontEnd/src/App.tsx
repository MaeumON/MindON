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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/prejoin/:groupId/:groupName" element={<PreJoin />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpwd" element={<FindPwd />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mydata" element={<MyData />} />
        <Route path="/mydata/grouplist/:status" element={<MyDataList />} />
        <Route
          path="/mydata/grouplist"
          element={<div className="font-jamsilMedium text-32px flex justify-center my-10">잘못된 주소입니다!</div>}
        />
        <Route path="/mydata/:groupid" element={<MyDataDetail />} />
        <Route path="/groupslist" element={<GroupsList />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
