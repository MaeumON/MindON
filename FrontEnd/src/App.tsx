import { Route, Routes } from "react-router-dom";
import HomePage from "@pages/HomePage";
import PreJoin from "@pages/OpenVidu/PreJoin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/prejoin" element={<PreJoin />} />
    </Routes>
  );
}

export default App;
