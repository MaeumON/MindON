import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { OpenVidu, Publisher, Session, StreamManager, Device } from "openvidu-browser";
import ChatComponent from "./chat/ChatComponent";
import StreamComponent from "./stream/StreamComponent";
import "./VideoRoomComponent.css";
import OpenViduLayout from "@components/Openvidu-call/layout/openvidu-layout";
import UserModel from "../models/user-model";
import ToolbarComponent from "./toolbar/ToolbarComponent";
import { VideoRoomProps, UserModelType, VideoRoomState } from "../types";

const APPLICATION_SERVER_URL = process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/";

const localUser = new UserModel();

const VideoRoomComponent: React.FC<VideoRoomProps> = ({
  sessionName = "SessionA",
  user = `OpenVidu_User${Math.floor(Math.random() * 100)}`,
  token,
  error,
  joinSession: onJoinSession,
  leaveSession: onLeaveSession,
}) => {
  const [state, setState] = useState<VideoRoomState>({
    mySessionId: sessionName,
    myUserName: user,
    session: undefined,
    localUser: undefined,
    subscribers: [],
    chatDisplay: "none",
    currentVideoDevice: undefined,
    showExtensionDialog: false,
    messageReceived: false,
  });

  const OV = useRef<OpenVidu>();
  const layout = useRef(new OpenViduLayout());
  const remotes = useRef<UserModelType[]>([]);
  const localUserAccessAllowed = useRef<boolean>(false);
  const hasBeenUpdated = useRef<boolean>(false);

  const getToken = useCallback(async () => {
    const sessionId = await createSession(state.mySessionId);
    return await createToken(sessionId);
  }, [state.mySessionId]);

  const createSession = useCallback(async (sessionId: string) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }, []);

  const createToken = useCallback(async (sessionId: string) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }, []);

  const connectToSession = useCallback(async () => {
    if (token !== undefined) {
      console.log("token received: ", token);
      connect(token);
    } else {
      try {
        const token = await getToken();
        console.log(token);
        connect(token);
      } catch (error: any) {
        console.error("There was an error getting the token:", error.code, error.message);
        if (error) {
          error({
            error: error.error,
            message: error.message,
            code: error.code,
            status: error.status,
          });
        }
        alert("There was an error getting the token: " + error.message);
      }
    }
  }, [token, getToken]);

  const connect = useCallback(
    (token: string) => {
      state.session
        ?.connect(token, { clientData: state.myUserName })
        .then(() => {
          connectWebCam();
        })
        .catch((error) => {
          if (error) {
            error({
              error: error.error,
              message: error.message,
              code: error.code,
              status: error.status,
            });
          }
          alert("There was an error connecting to the session: " + error.message);
          console.log("There was an error connecting to the session:", error.code, error.message);
        });
    },
    [state.session, state.myUserName]
  );

  const connectWebCam = useCallback(async () => {
    if (!OV.current) return;

    await OV.current.getUserMedia({ audioSource: undefined, videoSource: undefined });
    const devices = await OV.current.getDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");

    const publisher = OV.current.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

    //사용자가 카메라 마이크 접근을 허용했을 때
    if (state.session?.capabilities.publish) {
      publisher.on("accessAllowed", () => {
        state.session?.publish(publisher).then(() => {
          updateSubscribers(); //다른 참가자들 목록 업데이트
          localUserAccessAllowed.current = true; //접근 허용 상태 기록
          if (onJoinSession) {
            //세션 참여 콜백 함수 실행
            onJoinSession();
          }
        });
      });
    }

    localUser.setNickname(state.myUserName);
    localUser.setConnectionId(state.session?.connection.connectionId || "");
    localUser.setScreenShareActive(false);
    localUser.setStreamManager(publisher);
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });

    setState((prev) => ({
      ...prev,
      currentVideoDevice: videoDevices[0],
      localUser: localUser as UserModelType,
    }));

    publisher.on("streamPlaying", () => {
      updateLayout();
      publisher.videos[0].video.parentElement?.classList.remove("custom-class");
    });
  }, [state.session, state.myUserName, onJoinSession]);

  const updateSubscribers = useCallback(() => {
    setState((prev) => ({
      ...prev,
      subscribers: remotes.current,
    }));

    if (state.localUser) {
      sendSignalUserChanged({
        isAudioActive: state.localUser.isAudioActive(),
        isVideoActive: state.localUser.isVideoActive(),
        nickname: state.localUser.getNickname(),
        isScreenShareActive: state.localUser.isScreenShareActive(),
      });
    }
    updateLayout();
  }, [state.localUser]);

  const leaveSession = useCallback(() => {
    if (state.session) {
      state.session.disconnect();
    }

    OV.current = undefined;
    setState((prev) => ({
      ...prev,
      session: undefined,
      subscribers: [],
      mySessionId: "SessionA",
      myUserName: "OpenVidu_User" + Math.floor(Math.random() * 100),
      localUser: undefined,
    }));

    if (onLeaveSession) {
      onLeaveSession();
    }
  }, [state.session, onLeaveSession]);

  const camStatusChanged = useCallback(() => {
    localUser.setVideoActive(!localUser.isVideoActive());
    const streamManager = localUser.getStreamManager();
    if (streamManager) {
      (streamManager as Publisher).publishVideo(localUser.isVideoActive());
      sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
      setState((prev) => ({ ...prev, localUser: localUser as UserModelType }));
    }
  }, []);

  const micStatusChanged = useCallback(() => {
    localUser.setAudioActive(!localUser.isAudioActive());
    const streamManager = localUser.getStreamManager();
    if (streamManager) {
      (streamManager as Publisher).publishAudio(localUser.isAudioActive());
      sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
      setState((prev) => ({ ...prev, localUser: localUser as UserModelType }));
    }
  }, []);

  const nicknameChanged = useCallback((nickname: string) => {
    localUser.setNickname(nickname);
    setState((prev) => ({ ...prev, localUser: localUser as UserModelType }));
    sendSignalUserChanged({ nickname: localUser.getNickname() });
  }, []);

  const deleteSubscriber = useCallback(
    (stream: any) => {
      const remoteUsers = state.subscribers;
      const userStream = remoteUsers.filter((user) => user.getStreamManager().stream === stream)[0];
      const index = remoteUsers.indexOf(userStream, 0);
      if (index > -1) {
        remoteUsers.splice(index, 1);
        setState((prev) => ({
          ...prev,
          subscribers: remoteUsers,
        }));
      }
    },
    [state.subscribers]
  );

  const subscribeToStreamCreated = useCallback(() => {
    state.session?.on("streamCreated", (event) => {
      const subscriber = state.session?.subscribe(event.stream, undefined);
      subscriber?.on("streamPlaying", () => {
        checkSomeoneShareScreen();
        subscriber.videos[0].video.parentElement?.classList.remove("custom-class");
      });

      const newUser = new UserModel();
      if (subscriber) {
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setType("remote");
      }
      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      remotes.current.push(newUser as UserModelType);

      if (localUserAccessAllowed.current) {
        updateSubscribers();
      }
    });
  }, [state.session]);

  const subscribeToStreamDestroyed = useCallback(() => {
    state.session?.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream);
      setTimeout(() => {
        checkSomeoneShareScreen();
      }, 20);
      event.preventDefault();
      updateLayout();
    });
  }, [state.session, deleteSubscriber]);

  const subscribeToUserChanged = useCallback(() => {
    state.session?.on("signal:userChanged", (event) => {
      const remoteUsers = state.subscribers;
      remoteUsers.forEach((user) => {
        if (event.from && user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data || "");
          console.log("EVENTO REMOTE: ", event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive);
          }
        }
      });
      setState((prev) => ({
        ...prev,
        subscribers: remoteUsers,
      }));
      checkSomeoneShareScreen();
    });
  }, [state.session, state.subscribers]);

  const updateLayout = useCallback(() => {
    setTimeout(() => {
      layout.current.updateLayout();
    }, 20);
  }, []);

  const sendSignalUserChanged = useCallback(
    (data: any) => {
      const signalOptions = {
        data: JSON.stringify(data),
        type: "userChanged",
      };
      state.session?.signal(signalOptions);
    },
    [state.session]
  );

  const toggleFullscreen = useCallback(() => {
    const document = window.document;
    const fs = document.getElementById("container");
    if (!fs) return;

    if (!document.fullscreenElement) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  const switchCamera = useCallback(async () => {
    try {
      if (!OV.current) return;

      const devices = await OV.current.getDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter((device) => device.deviceId !== state.currentVideoDevice?.deviceId);

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.current.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: localUser.isAudioActive(),
            publishVideo: localUser.isVideoActive(),
            mirror: true,
          });

          if (state.session && state.localUser) {
            await state.session.unpublish(state.localUser.getStreamManager() as Publisher);
            await state.session.publish(newPublisher);
            state.localUser.setStreamManager(newPublisher);
            setState((prev) => ({
              ...prev,
              currentVideoDevice: newVideoDevice[0],
              localUser: state.localUser,
            }));
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [state.session, state.localUser, state.currentVideoDevice]);

  const screenShare = useCallback(() => {
    const videoSource = navigator.userAgent.indexOf("Firefox") !== -1 ? "window" : "screen";
    if (!OV.current) return;

    const publisher = OV.current.initPublisher(
      undefined,
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      },
      (error) => {
        if (error && error.name === "SCREEN_EXTENSION_NOT_INSTALLED") {
          setState((prev) => ({ ...prev, showExtensionDialog: true }));
        } else if (error && error.name === "SCREEN_SHARING_NOT_SUPPORTED") {
          alert("Your browser does not support screen sharing");
        } else if (error && error.name === "SCREEN_EXTENSION_DISABLED") {
          alert("You need to enable screen sharing extension");
        } else if (error && error.name === "SCREEN_CAPTURE_DENIED") {
          alert("You need to choose a window or application to share");
        }
      }
    );

    publisher.once("accessAllowed", () => {
      if (state.session) {
        state.session.unpublish(localUser.getStreamManager() as Publisher);
        localUser.setStreamManager(publisher);
        state.session.publish(localUser.getStreamManager() as Publisher).then(() => {
          localUser.setScreenShareActive(true);
          setState((prev) => ({ ...prev, localUser: localUser as UserModelType }));
          sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
        });
      }
    });

    publisher.on("streamPlaying", () => {
      updateLayout();
      publisher.videos[0].video.parentElement?.classList.remove("custom-class");
    });
  }, [state.session]);

  const stopScreenShare = useCallback(() => {
    if (state.session) {
      state.session.unpublish(localUser.getStreamManager() as Publisher);
    }
    connectWebCam();
  }, [state.session, connectWebCam]);

  const checkSomeoneShareScreen = useCallback(() => {
    let isScreenShared =
      state.subscribers.some((user) => user.isScreenShareActive()) || localUser.isScreenShareActive();

    const openviduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: isScreenShared,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };

    layout.current.setLayoutOptions(openviduLayoutOptions);
    updateLayout();
  }, [state.subscribers]);

  const toggleChat = useCallback(
    (property?: string) => {
      let display = property;

      if (display === undefined) {
        display = state.chatDisplay === "none" ? "block" : "none";
      }

      if (display === "block") {
        setState((prev) => ({
          ...prev,
          chatDisplay: display,
          messageReceived: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          chatDisplay: display,
        }));
      }
      updateLayout();
    },
    [state.chatDisplay]
  );

  const checkNotification = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messageReceived: prev.chatDisplay === "none",
    }));
  }, []);

  const checkSize = useCallback(() => {
    const layoutElement = document.getElementById("layout");
    if (layoutElement && layoutElement.offsetWidth <= 700 && !hasBeenUpdated.current) {
      toggleChat("none");
      hasBeenUpdated.current = true;
    }
    if (layoutElement && layoutElement.offsetWidth > 700 && hasBeenUpdated.current) {
      hasBeenUpdated.current = false;
    }
  }, [toggleChat]);

  useEffect(() => {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: false,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };

    const layoutElement = document.getElementById("layout");
    if (layoutElement) {
      layout.current.initLayoutContainer(layoutElement, openViduLayoutOptions);
    }
    window.addEventListener("beforeunload", leaveSession);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("resize", checkSize);

    if (!state.session) {
      OV.current = new OpenVidu();
      if (OV.current) {
        setState((prev) => ({
          ...prev,
          session: OV.current.initSession(),
        }));
        subscribeToStreamCreated();
      }
      connectToSession();
    }

    return () => {
      window.removeEventListener("beforeunload", leaveSession);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("resize", checkSize);
      leaveSession();
    };
  }, []);

  return (
    <div className="container" id="container">
      <ToolbarComponent
        sessionId={state.mySessionId}
        user={state.localUser}
        showNotification={state.messageReceived}
        camStatusChanged={camStatusChanged}
        micStatusChanged={micStatusChanged}
        screenShare={screenShare}
        stopScreenShare={stopScreenShare}
        toggleFullscreen={toggleFullscreen}
        switchCamera={switchCamera}
        leaveSession={leaveSession}
        toggleChat={toggleChat}
      />

      <div id="layout" className="bounds">
        {state.localUser && state.localUser.getStreamManager() && (
          <div className="OT_root OT_publisher custom-class" id="localUser">
            <StreamComponent user={state.localUser} handleNickname={nicknameChanged} />
          </div>
        )}

        {state.subscribers.map((sub, i) => (
          <div key={i} className="OT_root OT_publisher custom-class" id="remoteUsers">
            <StreamComponent user={sub} streamId={sub.getStreamManager().stream.streamId} />
          </div>
        ))}

        {state.localUser && state.localUser.getStreamManager() && (
          <div className="OT_root OT_publisher custom-class" style={{ display: state.chatDisplay }}>
            <ChatComponent
              user={state.localUser as UserModel}
              chatDisplay={state.chatDisplay}
              close={toggleChat}
              messageReceived={checkNotification}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRoomComponent;
