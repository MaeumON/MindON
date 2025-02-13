import React, { useEffect, useRef, useState } from "react";
import UserModel from "../../models/user-model";
import { Session } from "openvidu-browser";

interface OvVideoProps {
  user: UserModel;
  session?: Session;
  mutedSound: boolean;
}

// interface UserModel {
//   getStreamManager: () => StreamManager;
// }

// interface StreamManager {
//   addVideoElement: (element: HTMLVideoElement) => void;
//   stream: {
//     streamId: string;
//   };
//   session: {
//     on: (event: string, callback: (event: any) => void) => void;
//   };
// }

const OvVideoComponent: React.FC<OvVideoProps> = ({ user, session, mutedSound }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current && user.getStreamManager()) {
      user.getStreamManager()?.addVideoElement(videoRef.current);

      // Add audio level detector
      const streamManager = user.getStreamManager();
      streamManager?.on("streamAudioVolumeChange", (event: any) => {
        // Typically, background noise is around 0-15
        // Speaking is usually above 20-30
        const SPEAKING_THRESHOLD = -35;
        setIsSpeaking(event.value.newValue > SPEAKING_THRESHOLD);
      });
    }
  }, [user]);

  useEffect(() => {
    if (session) {
      session.on("signal:userChanged", (event) => {
        const data = JSON.parse(event.data || "{}");

        console.log("audio changed :", data.isAudioActive);
        if (data.isScreenShareActive !== undefined && videoRef.current) {
          user.getStreamManager()?.addVideoElement(videoRef.current);
        }
      });
    }
  }, [user]);

  return (
    <video
      autoPlay={true}
      id={"video-" + user.getStreamManager()?.stream.streamId}
      ref={videoRef}
      muted={mutedSound}
      className={`rounded-[12px] ${isSpeaking ? "border border-green100 shadow-[0px_0px_12px_4px_#6BB07C]" : ""}`}
    />
  );
};

export default OvVideoComponent;
