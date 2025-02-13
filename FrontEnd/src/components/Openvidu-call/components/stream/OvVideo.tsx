import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (videoRef.current && user.getStreamManager()) {
      user.getStreamManager()?.addVideoElement(videoRef.current);
    }
  }, [user]);

  useEffect(() => {
    if (session) {
      session.on("signal:userChanged", (event) => {
        const data = JSON.parse(event.data || "{}");
        if (data.isScreenShareActive !== undefined && videoRef.current) {
          user.getStreamManager()?.addVideoElement(videoRef.current);
        }
      });
    }
  }, [user]);

  return (
    <video autoPlay={true} id={"video-" + user.getStreamManager()?.stream.streamId} ref={videoRef} muted={mutedSound} />
  );
};

export default OvVideoComponent;
