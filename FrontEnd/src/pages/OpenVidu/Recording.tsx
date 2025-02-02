// import axios from "axios";

// const APPLICATION_SERVER_URL = import.meta.env.NODE_ENV === "production" ? "" : `http://localhost:5000/`;
// // const APPLICATION_SERVER_URL = process.env.NODE_ENV === "production" ? "" : `http://localhost:5000/`;
// // const APPLICATION_SERVER_URL = process.env.NODE_ENV === "production" ? "" : `https://demos.openvidu.io/`;

// const SESSION_ID = "GroupID"; //전역에 설정되어야하는 값
// // const GROUP_NAME = "소아암 아이를 키우는 부모 모임";
// const OUTPUT_MODE = "COMPOSED";
// const FORCE_RECORDING_ID = "";

// const Recording = () => {
//   // const [hasAudio, setHasAudio] = useState(true);
//   // const [hasVideo, setHasVideo] = useState(true);
//   const hasAudio = true;
//   const hasVideo = true;

//   async function startRecording() {
//     const response = await axios.post(
//       APPLICATION_SERVER_URL + "recording-java/api/recording/start",
//       {
//         session: SESSION_ID,
//         outputMode: OUTPUT_MODE,
//         hasAudio: hasAudio,
//         hasVideo: hasVideo,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//         },
//         withCredentials: true,
//       }
//     );

//     console.log("start recording response", response);
//   }

//   async function stopRecording() {
//     const response = await axios.post(
//       APPLICATION_SERVER_URL + "recording-java/api/recording/stop",
//       {
//         recording: FORCE_RECORDING_ID,
//       },
//       {
//         headers: { "Content-Type": "application/json", withCredentials: true },
//       }
//     );

//     console.log("stop recording response", response);
//   }

//   async function deleteRecording() {
//     const response = await axios.delete(APPLICATION_SERVER_URL + "recording-java/api/recording/delete", {
//       data: {
//         recording: FORCE_RECORDING_ID,
//       },
//       headers: { "Content-Type": "application/json", withCredentials: true },
//     });

//     console.log("delete recording response", response);
//   }

//   async function getRecording() {
//     const response = await axios.get(
//       APPLICATION_SERVER_URL + "recording-java/api/recording/get/" + FORCE_RECORDING_ID,
//       {
//         headers: { "Content-Type": "application/json", withCredentials: true },
//       }
//     );

//     console.log("get recording response", response);
//   }

//   async function listRecordings() {
//     const response = await axios.get(APPLICATION_SERVER_URL + "recording-java/api/recording/list", {
//       headers: { "Content-Type": "application/json", withCredentials: true },
//     });

//     console.log("list recording response", response);
//   }

//   return (
//     <div>
//       <button className="p-2 border rounded-[12px] bg-green100 text-white" onClick={startRecording}>
//         START RECORDING
//       </button>
//       <button className="p-2 border rounded-[12px] bg-red100 text-white" onClick={stopRecording}>
//         STOP RECORDING
//       </button>
//       <button className="p-2 border rounded-[12px] bg-cardSubcontent text-black" onClick={deleteRecording}>
//         DELETE RECORDING
//       </button>
//       <button className="p-2 border rounded-[12px] bg-cardSubcontent text-black" onClick={getRecording}>
//         GET RECORDING
//       </button>
//       <button className="p-2 border rounded-[12px] bg-cardSubcontent text-black" onClick={listRecordings}>
//         LIST RECORDINGS
//       </button>
//     </div>
//   );
// };

// export default Recording;
