import { useState, useRef, useEffect, useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import HighlightOff from "@material-ui/icons/HighlightOff";
import Send from "@material-ui/icons/Send";
import "./ChatComponent.css";
import { Tooltip } from "@material-ui/core";

interface ChatComponentProps {
  user: UserModel;
  chatDisplay: string;
  close: (property: string) => void;
  messageReceived: () => void;
}

interface UserModel {
  getStreamManager: () => StreamManager;
  getNickname: () => string;
  getConnectionId: () => string;
}

interface StreamManager {
  stream: {
    session: Session;
    streamId: string;
  };
}

interface Session {
  on: (event: string, callback: (event: any) => void) => void;
  signal: (options: SignalOptions) => void;
}

interface SignalOptions {
  data: string;
  type: string;
}

interface Message {
  connectionId: string;
  nickname: string;
  message: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ user, chatDisplay, close, messageReceived }) => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const chatScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    user.getStreamManager().stream.session.on("signal:chat", (event) => {
      const data = JSON.parse(event.data);
      const newMessage: Message = {
        connectionId: event.from.connectionId,
        nickname: data.nickname,
        message: data.message,
      };

      setMessageList((prevList) => [...prevList, newMessage]);

      const document = window.document;
      setTimeout(() => {
        const userImg = document.getElementById("userImg-" + messageList.length) as HTMLCanvasElement;
        const video = document.getElementById("video-" + data.streamId) as HTMLVideoElement;
        if (userImg && video) {
          const avatar = userImg.getContext("2d");
          if (avatar) {
            avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
            messageReceived();
          }
        }
      }, 50);

      scrollToBottom();
    });
  }, [user, messageList.length, messageReceived]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handlePressKey = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (message) {
      let messageText = message.replace(/ +(?= )/g, "");
      if (messageText !== "" && messageText !== " ") {
        const data = {
          message: messageText,
          nickname: user.getNickname(),
          streamId: user.getStreamManager().stream.streamId,
        };
        user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: "chat",
        });
      }
    }
    setMessage("");
  }, [message, user]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (chatScroll.current) {
        chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
      }
    }, 20);
  }, []);

  const closeChat = useCallback(() => {
    close("");
  }, [close]);

  return (
    <div id="chatContainer">
      <div id="chatComponent" style={{ display: chatDisplay }}>
        <div id="chatToolbar">
          {/* <span>{user.getStreamManager().stream.session.sessionId} - CHAT</span> */}
          <IconButton id="closeButton" onClick={closeChat}>
            <HighlightOff color="secondary" />
          </IconButton>
        </div>
        <div className="message-wrap" ref={chatScroll}>
          {messageList.map((data, i) => (
            <div
              key={i}
              id="remoteUsers"
              className={`message ${data.connectionId !== user.getConnectionId() ? "left" : "right"}`}
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

        <div id="messageInput">
          <input
            placeholder="Send a message"
            id="chatInput"
            value={message}
            onChange={handleChange}
            onKeyPress={handlePressKey}
          />
          <Tooltip title="Send message">
            <Fab size="small" id="sendButton" onClick={sendMessage}>
              <Send />
            </Fab>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
