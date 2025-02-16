import { useCallback, useEffect, useRef, useState } from "react";
import { OpenVidu, Publisher } from "openvidu-browser";
import { useNavigate, useParams } from "react-router-dom";
import { createSessionResponse, UserModelType, VideoRoomState } from "@utils/openvidu/openviduTypes";
import Room from "@pages/openvidu/Room";
import NoHostRoom from "@pages/openvidu/NoHostRoom";
import UserModel from "@components/Openvidu-call/models/user-model";
import Button from "@components/common/Button";
import OpenViduLayout from "@components/Openvidu-call/layout/openvidu-layout";
import IconCheck from "@assets/icons/IconCheck";
import { fetchMeetingId } from "@apis/openvidu/questionApi";
import { closeSession, createSession, createToken, removeUser } from "@apis/openvidu/openviduApi";
import useAuthStore from "@stores/authStore";
import { useQuestionStore } from "@stores/questionStore";

/*
실제 화상채팅으로 진입하기 전에,
- 전역으로 받아온 UserName, SessionID로 토큰 생성
- 참가자 비디오 및 음성 미리 확인
- 세션에 참여: connectToRoom
- 참여하기 버튼으로 화상 화면으로 이동
*/
//임시, 추후 참가하기 버튼에 있던 그룹 정보에서 가져오기

const localUser = new UserModel();

const Prejoin = () => {
  const navigate = useNavigate();
  const { groupId, groupName } = useParams();
  const SESSION_ID = String(groupId);
  const GROUP_NAME = groupName;

  const { userName, userId } = useAuthStore();
  const { reset: resetQuestionStore } = useQuestionStore();
  const layout = useRef(new OpenViduLayout());

  const [state, setState] = useState<VideoRoomState>({
    sessionId: SESSION_ID, //meetingID
    userName: userName,
    session: undefined,
    localUser: undefined, //publisher
    subscribers: [],
    currentVideoDevice: undefined,
  });

  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [token, setToken] = useState<string>("");
  const [meetingId, setMeetingId] = useState<number>(0);
  const [isHost, setIsHost] = useState<boolean>(false); //호스트여부에 따라 레이아웃 달리하기 위함
  const remotes = useRef<UserModelType[]>([]); //실제 참여자 목록은 state.subscribers로 관리되기 때문에 useRef로 설정
  // const layout = useRef(new OpenViduLayout());

  //세션 생성 함수
  const joinSession = () => {
    const OVs = new OpenVidu();
    setOV(OVs);
    setState({ ...state, session: OVs.initSession() });
  };

  const connectToRoom = async () => {
    console.log("connectToRoom", token, " session ", state.session);

    if (!token || !state.session || !OV) {
      return;
    }

    try {
      //세션 연결
      state.session
        ?.connect(token, {
          clientData: {
            userName: state.userName,
            userId: userId, // userId는 상태에서 가져오거나 props로 전달받아야 합니다
          },
        })
        .then(() => {
          //카메라 연결
          connectWebCam();
        });
    } catch (error) {
      console.log("There was an error connecting to the session:", error);
    }
  };

  // 웹캠 연결
  const connectWebCam = async () => {
    console.log("connectWebCam", OV, state.session);
    if (!OV || !state.session) {
      console.log("OV is null");
      return;
    }

    const publisher = OV.initPublisher(undefined, {
      audioSource: undefined, //오디오 소스
      videoSource: undefined, //비디오 소스
      publishAudio: localUser.isAudioActive(), //시작할 때 오디오 뮤트 여부
      publishVideo: localUser.isVideoActive(), //시작할 때 비디오 뮤트 여부
      resolution: "320x360", //해상도
      frameRate: 30, //프레임 레이트
      insertMode: "APPEND", //비디오 삽입 모드
      mirror: false, //미러 여부
    });

    state.session
      .publish(publisher)
      .then(() => {
        updateSubscribers();
      })
      .catch(() => {});

    // 로컬 사용자 설정
    localUser.setUserId(userId);
    localUser.setNickname(state.userName);
    localUser.setConnectionId(state.session?.connection.connectionId || "");
    localUser.setStreamManager(publisher);

    subscribeToUserChanged();
    subscribeToStreamDestroyed();

    setState((prev) => ({
      ...prev,
      localUser: localUser as UserModelType,
    }));

    publisher.on("streamPlaying", () => {
      updateLayout();
    });
  };

  const updateLayout = useCallback(() => {
    setTimeout(() => {
      layout.current.updateLayout();
    }, 20);
  }, []);

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
        userId: state.localUser.getUserId(),
      });
    }

    updateLayout();
  }, [state.localUser]);

  const deleteSubscriber = useCallback(
    async (stream: any) => {
      // remotes.current에서도 해당 유저를 제거
      remotes.current = remotes.current.filter((user) => user.getStreamManager().stream !== stream);

      // state의 subscribers도 업데이트
      const remoteUsers = state.subscribers.filter((user) => user.getStreamManager().stream !== stream);

      setState((prev) => ({
        ...prev,
        subscribers: remoteUsers,
      }));

      // 모든 참가자가 나갔는지 확인 (remoteUsers가 비어있고 localUser도 없는 경우)
      // if (remoteUsers.length === 0 && !state.localUser) {
      //   console.log("마지막 참가자가 나갔습니다. 세션을 종료합니다.");
      //   await closeSession(state.sessionId);
      // }
    },
    [state.subscribers, state.localUser, state.sessionId]
  );

  // 세션에 참여하는 사람 생길 때 이벤트 처리
  const subscribeToStreamCreated = useCallback(() => {
    if (!state.session) return;

    state.session.on("streamCreated", (event) => {
      const subscriber = state.session?.subscribe(event.stream, undefined);

      console.log("event ", event);
      console.log("### event stream connections", event.stream.connection);

      const newUser = new UserModel();

      //새로운 유저가 들어오면, remote 타입의 새로운 유저 생성
      if (subscriber) {
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setType("remote");
      }

      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData.userName);
      newUser.setUserId(JSON.parse(nickname).clientData.userId);
      remotes.current.push(newUser as UserModelType);

      updateSubscribers();
    });
  }, [state.session]);

  const subscribeToStreamDestroyed = useCallback(() => {
    state.session?.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream);
      event.preventDefault();
      updateLayout();
    });
  }, [state.session, deleteSubscriber]);

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

  const subscribeToUserChanged = useCallback(() => {
    // OpenVidu 세션에서 'signal:userChanged' 이벤트를 구독
    // 다른 참가자가 자신의 상태를 변경할 때마다 이 이벤트가 발생
    state.session?.on("signal:userChanged", (event) => {
      // 현재 연결된 모든 원격 참가자들의 목록을 가져옴
      const remoteUsers = state.subscribers;

      // 모든 원격 참가자들을 순회하면서 상태 변경이 필요한 참가자를 찾음
      remoteUsers.forEach((user) => {
        // event.from에는 신호를 보낸 참가자의 정보가 있음
        // 해당 참가자의 connectionId와 일치하는 사용자를 찾아 상태 업데이트
        if (event.from && user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data || "");
          console.log("EVENTO REMOTE: ", event.data);

          // 오디오 상태 변경 (음소거/음소거 해제)
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          // 비디오 상태 변경 (카메라 켜기/끄기)
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
        }
      });
      // 변경된 사용자 정보로 상태 업데이트
      setState((prev) => ({
        ...prev,
        subscribers: remoteUsers,
      }));

      console.log("userChanged", remoteUsers);
    });
  }, [state.session, state.subscribers]);

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

  // 타이머 종료 시 closeSession 호출 , 임시 console.log
  console.log(closeSession);
  // async function handleCloseSession() {
  //   await closeSession(state.sessionId);

  //   setOV(null);
  //   setState({
  //     ...state,
  //     session: undefined,
  //     sessionId: String(SESSION_ID),
  //     userName: userName,
  //     subscribers: [],
  //     localUser: undefined,
  //   });

  //   remotes.current = [];
  //   console.log("leaveSession", state);
  //   console.log("remotes ", remotes.current);
  // }

  async function handleRemoveUser() {
    const requestData = { sessionName: state.sessionId, token: token };

    if (state.session) {
      await removeUser(requestData);
    }

    navigate("/main");
  }

  // 유저가 '참여하기' 버튼 누르면, joinSession 함수가 호출되면서
  // session과 OV 값이 바뀌면서 아래 useEffect 실행됨
  useEffect(() => {
    // 세션에 참여하는 사람 생길 때 이벤트 처리
    subscribeToStreamCreated();
    //세션 연결
    connectToRoom();
  }, [state.session, OV]);

  const getToken = async (sessionId: string): Promise<string> => {
    const { sessionId: createdSessionId, host: isHost }: createSessionResponse = await createSession(sessionId);
    const generatedToken = await createToken(createdSessionId);

    setIsHost(isHost);
    // setIsHost(false); //테스트용

    return generatedToken;
  };

  const getMeetingId = async (groupId: string): Promise<number> => {
    const meetingId = await fetchMeetingId(groupId);
    return meetingId;
  };

  useEffect(() => {
    //마운트될 때, 바로 토큰 생성
    getToken(state.sessionId).then((token) => setToken(token));

    getMeetingId(SESSION_ID).then((meetingId) => {
      setMeetingId(meetingId);
    });

    return () => {
      //언마운트될 때, 사용자 세션 나가기 함수 호출
      // window.removeEventListener("resize", updateLayout);
      if (token && state.sessionId) removeUser({ sessionName: state.sessionId, token: token });
      if (state.subscribers.length === 0 && !state.localUser) {
        // console.log("마지막 참가자가 나갔습니다. 세션을 종료합니다.");
        // handleCloseSession();
        console.log("questionStore 초기화");
        resetQuestionStore();
      }
    };
  }, []);

  return (
    <section className="w-full h-full min-h-screen flex flex-col items-center">
      <div className="w-full h-[80px] font-jamsilMedium text-20px sm:text-24px text-center leading-[80px]">
        {GROUP_NAME}
      </div>
      {state.session && !isHost && (
        <NoHostRoom
          meetingId={meetingId}
          session={state.session}
          mySessionId={state.sessionId}
          localUser={localUser}
          subscribers={state.subscribers}
          camStatusChanged={camStatusChanged}
          micStatusChanged={micStatusChanged}
          handleRemoveUser={handleRemoveUser}
        />
      )}
      {state.session && isHost && (
        <Room
          meetingId={meetingId}
          session={state.session}
          mySessionId={state.sessionId}
          localUser={localUser}
          subscribers={state.subscribers}
          camStatusChanged={camStatusChanged}
          micStatusChanged={micStatusChanged}
          handleRemoveUser={handleRemoveUser}
        />
      )}
      {!state.session && (
        <div className="w-[95%] h-[70%] mt-[20px] flex flex-col justify-around items-center font-suite">
          <div className="w-full flex flex-col items-center justify-center  rounded-[12px] shadow-md bg-white">
            <div className="w-[90%] h-[100px] mt-[43px] p-[17px] font-bold  text-20px sm:text-24px text-cardLongContent text-center rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] leading-[70px] bg-offWhite">
              모임 중 지켜야 할 규칙
            </div>
            <div className="w-[90%] h-[171px] my-[30px] flex flex-col justify-center gap-[10px] font-medium text-14px sm:text-16px">
              <div className="h-[30px] px-[10px] flex items-center gap-[10px]">
                <IconCheck width={26} height={26} fillColor="#6BB07C" />
                <p>발언 기회를 존중해 주세요.</p>
              </div>
              <div className="h-[30px] px-[10px] flex items-center gap-[10px]">
                <IconCheck width={26} height={26} fillColor="#6BB07C" />
                <p>적극적으로 경청해 주세요.</p>
              </div>
              <div className="h-[30px] px-[10px] flex items-center gap-[10px]">
                <IconCheck width={26} height={26} fillColor="#6BB07C" />
                <p>정중하고 예의 바르게 대화해 주세요.</p>
              </div>
              <div className="h-[30px] px-[10px] flex items-center gap-[10px]">
                <IconCheck width={26} height={26} fillColor="#6BB07C" />
                <p>부정적인 표현이나 비난은 삼가해 주세요.</p>
              </div>
            </div>
          </div>
          <div className="w-full mt-[50px]">
            <Button text="참여하기" type="GREEN" onClick={joinSession} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Prejoin;
