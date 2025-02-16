import React, { useState, useCallback } from "react";
import IconExit from "@assets/icons/IconExit";
import IconSendMsg from "@assets/icons/IconSendMsg";
import { StreamManager } from "openvidu-browser";
import { Message } from "@/utils/openvidu/openviduTypes";

interface ChatComponentProps {
  user: {
    getStreamManager: () => StreamManager | null;
    getNickname: () => string;
    getConnectionId: () => string;
  };
  close: (isOpen: boolean) => void;
  messageList: Message[];
  chatScroll: React.RefObject<HTMLDivElement>;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ user, close, messageList, chatScroll }) => {
  const [message, setMessage] = useState<string>("");

  const sendMessage = () => {
    if (message.trim() === "") return;

    const session = user?.getStreamManager()?.stream.session;
    if (session) {
      const messageData = {
        message: message,
        nickname: user.getNickname(),
      };

      session.signal({
        data: JSON.stringify(messageData),
        type: "chat",
      });

      setMessage("");
    }
  };

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const closeChat = () => {
    close(false);
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center w-full h-[100%] bg-black/50">
      <div className="w-[90%] h-[600px] py-[10px] flex flex-col justify-between bg-white/80 rounded-[12px]">
        <div className="mt-[5px] mr-[10px] flex items-start justify-end">
          {/* <span>{user.getStreamManager().stream.session.sessionId} - CHAT</span> */}
          <div onClick={closeChat}>
            <IconExit width={25} height={25} fillColor="" />
          </div>
        </div>
        <div
          ref={chatScroll}
          className="w-full h-full mt-[15px] px-[15px] py-[10px] flex flex-col gap-[10px] overflow-y-scroll"
        >
          {messageList.map((data, i) => (
            <div key={i}>
              <div
                className={`px-[20px] py-[10px] rounded-[12px] ${data.connectionId !== user?.getConnectionId() ? "bg-white" : "bg-[#DDE9EC]"} shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] `}
              >
                <div className="text-14px font-bold">
                  <p>{data.nickname}</p>
                </div>
                <p className="text-14px font-medium">{data.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-[10px] flex justify-around items-center">
          <input
            placeholder="메시지를 입력하세요"
            value={message}
            onChange={handleChange}
            className="w-[85%] py-[12px] px-[8px] rounded-[12px] "
          />
          <div className="w-[10%] px-[5px]" onClick={sendMessage}>
            <IconSendMsg width={25} height={25} fillColor="#828282" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
