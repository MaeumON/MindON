import instance from "@apis/instance";

// const GROUP_NAME = "소아암 아이를 키우는 부모 모임";
const OUTPUT_MODE = "COMPOSED";

interface RecordingProps {
  sessionID: string;
}

const Recording = ({ sessionID }: RecordingProps) => {
  // const [hasAudio, setHasAudio] = useState(true);
  // const [hasVideo, setHasVideo] = useState(true);
  const hasAudio = true;
  const hasVideo = false;

  async function startRecording() {
    const response = await instance.post("/api/video/recording/start", {
      session: sessionID,
      outputMode: OUTPUT_MODE,
      hasAudio: hasAudio,
      hasVideo: hasVideo,
    });

    console.log("start recording response", response);
  }

  async function stopRecording() {
    const response = await instance.post("/api/video/recording/stop", {
      recording: sessionID,
    });

    console.log("stop recording response", response);
  }

  async function deleteRecording() {
    const response = await instance.delete("/api/video/recording/delete", {
      data: {
        recording: sessionID,
      },
    });

    console.log("delete recording response", response);
  }

  async function getRecording() {
    const response = await instance.get("/api/video/recording/get/" + sessionID);

    console.log("get recording response", response);
  }

  async function listRecordings() {
    const response = await instance.get("/api/video/recording/list");

    console.log("list recording response", response);
  }

  return (
    <div>
      <button className="p-2 border rounded-[12px] bg-green100 text-white" onClick={startRecording}>
        START RECORDING
      </button>
      <button className="p-2 border rounded-[12px] bg-red100 text-white" onClick={stopRecording}>
        STOP RECORDING
      </button>
      <button className="p-2 border rounded-[12px] bg-cardSubcontent text-black" onClick={deleteRecording}>
        DELETE RECORDING
      </button>
      <button className="p-2 border rounded-[12px] bg-cardSubcontent text-black" onClick={getRecording}>
        GET RECORDING
      </button>
      <button className="p-2 border rounded-[12px] bg-cardSubcontent text-black" onClick={listRecordings}>
        LIST RECORDINGS
      </button>
    </div>
  );
};

export default Recording;
