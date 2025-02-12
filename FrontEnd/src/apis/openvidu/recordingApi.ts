import authInstance from "../authinstance";

export async function startRecording({ sessionID }: { sessionID: string }) {
  const response = await authInstance.post("/api/video/recording/start", {
    session: sessionID,
    outputMode: "INDIVIDUAL",
    hasAudio: true,
    hasVideo: false,
  });

  console.log("start recording response", response);
}

export async function stopRecording({ sessionID, questionId }: { sessionID: string; questionId: number }) {
  const response = await authInstance.post("/api/video/recording/stop", {
    recording: sessionID,
    questionId: questionId,
  });

  console.log("stop recording response", response);
}
