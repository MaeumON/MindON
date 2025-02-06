import React, { useState, useRef, useCallback } from "react";
import "./ChatComponent.css";
import IconExit from "@assets/icons/IconExit";
import IconSendMsg from "@assets/icons/IconSendMsg";
import { StreamManager } from "openvidu-browser";

interface ChatComponentProps {
  user: {
    getStreamManager: () => StreamManager | null;
    getNickname: () => string;
    getConnectionId: () => string;
  };
  chatDisplay?: boolean;
  close: (isOpen: boolean) => void;
  messageReceived?: () => void;
}

interface Message {
  connectionId: string;
  nickname: string;
  message: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ user, close }) => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const chatScroll = useRef<HTMLDivElement>(null);

  console.log(setMessageList);

  // useEffect(() => {
  //   user.getStreamManager().stream.session.on("signal:chat", (event) => {
  //     const data = JSON.parse(event.data);
  //     const newMessage: Message = {
  //       connectionId: event.from.connectionId,
  //       nickname: data.nickname,
  //       message: data.message,
  //     };

  //     setMessageList((prevList) => [...prevList, newMessage]);

  //     const document = window.document;
  //     setTimeout(() => {
  //       const userImg = document.getElementById("userImg-" + messageList.length) as HTMLCanvasElement;
  //       const video = document.getElementById("video-" + data.streamId) as HTMLVideoElement;
  //       if (userImg && video) {
  //         const avatar = userImg.getContext("2d");
  //         if (avatar) {
  //           avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
  //           // messageReceived();
  //         }
  //       }
  //     }, 50);

  //     scrollToBottom();
  //   });
  // }, [user, messageList.length, messageReceived]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handlePressKey = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (message && user) {
      let messageText = message.replace(/ +(?= )/g, "");
      if (messageText !== "" && messageText !== " ") {
        const streamManager = user.getStreamManager();
        if (streamManager) {
          const data = {
            message: messageText,
            nickname: user.getNickname(),
            streamId: streamManager.stream.streamId,
          };
          streamManager.stream.session.signal({
            data: JSON.stringify(data),
            type: "chat",
          });
        }
      }
    }
    setMessage("");
  }, [message, user]);

  // const scrollToBottom = useCallback(() => {
  //   setTimeout(() => {
  //     if (chatScroll.current) {
  //       chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
  //     }
  //   }, 20);
  // }, []);

  const closeChat = () => {
    close(false);
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center w-[90%] h-[700px] bg-black/50">
      <div className="w-[90%] h-[600px] py-[10px] flex flex-col justify-between bg-white/80 rounded-[12px]">
        <div className="absolute inset-0 mt-[60px] mr-[30px] flex items-start justify-end">
          {/* <span>{user.getStreamManager().stream.session.sessionId} - CHAT</span> */}
          <div onClick={closeChat}>
            <IconExit width={25} height={25} fillColor="" />
          </div>
        </div>
        <div className="message-wrap" ref={chatScroll}>
          {messageList.map((data, i) => (
            <div
              key={i}
              id="remoteUsers"
              className={`message ${data.connectionId !== user?.getConnectionId() ? "left" : "right"}`}
            >
              <canvas id={`userImg-${i}`} width="60" height="60" className="user-img" />
              <div className="msg-detail">
                <div className="msg-info">
                  <p>{data.nickname}</p>
                </div>
                <div className="msg-content">
                  <span className="triangle" />
                  <p className="text">{data.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-[10px] flex justify-around items-center">
          <input
            placeholder="Send a message"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
            className="w-[85%] py-[12px] px-[8px] rounded-[12px] "
          />
          <div className="w-[10%] px-[5px]">
            <IconSendMsg width={25} height={25} fillColor="#828282" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
