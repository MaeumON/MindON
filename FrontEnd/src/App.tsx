import { Route, Routes } from "react-router-dom";
import HomePage from "@pages/HomePage";
import PreJoin from "@pages/openvidu/PreJoin";
import Welcome from "@pages/Welcome";
import Login from "@pages/auth/Login";
import SignUp from "@pages/auth/SignUp";
import FindId from "@pages/auth/FindId";
import FindPwd from "@pages/auth/FindPwd";
import Main from "@pages/Main";
import MyData from "@/pages/MyData";
import GroupsList from "@pages/Groups/GroupsList";
import MyDataDetail from "./pages/MyDataDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/prejoin" element={<PreJoin />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/findid" element={<FindId />} />
      <Route path="/findpwd" element={<FindPwd />} />
      <Route path="/main" element={<Main />} />
      <Route path="/mydata" element={<MyData />} />
      <Route path="/mydata/:id" element={<MyDataDetail />} />
      <Route path="/groupslist" element={<GroupsList />} />
    </Routes>
  );
}

export default App;
