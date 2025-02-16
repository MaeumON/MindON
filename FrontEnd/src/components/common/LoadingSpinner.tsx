import { SyncLoader } from "react-spinners";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SyncLoader
        color="#6BB07C"
        cssOverride={{
          margin: "0 auto",
          marginTop: "220px",
          textAlign: "center",
        }}
        // loading={isLoading}
        margin={5}
        size={25}
        speedMultiplier={1.5}
      />
      <div className="p-20 font-suite font-bold text-center text-20px">정보를 불러오고 있어요!</div>
    </div>
  );
}

export default LoadingSpinner;
