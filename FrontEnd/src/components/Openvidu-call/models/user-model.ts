import { UserModelType } from "@/utils/openvidu/openviduTypes";
import { StreamManager } from "openvidu-browser";

type UserType = "remote" | "local";

class UserModel {
  private connectionId: string;
  private audioActive: boolean;
  private videoActive: boolean;
  private nickname: string;
  private userId: string;
  private streamManager: StreamManager | null;
  private type: UserType;

  constructor(user?: UserModelType) {
    if (user) {
      this.connectionId = user.getConnectionId();
      this.audioActive = user.isAudioActive();
      this.videoActive = user.isVideoActive();
      this.nickname = user.getNickname();
      this.userId = user.getUserId();
      this.streamManager = user.getStreamManager();
      this.type = user.isLocal() ? "local" : "remote";
    } else {
      this.connectionId = "";
      this.audioActive = true;
      this.videoActive = true;
      this.nickname = "";
      this.streamManager = null;
      this.type = "local";
      this.userId = "";
    }
  }

  public isAudioActive(): boolean {
    return this.audioActive;
  }

  public isVideoActive(): boolean {
    return this.videoActive;
  }

  public getConnectionId(): string {
    return this.connectionId;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public getStreamManager(): StreamManager | null {
    return this.streamManager;
  }

  public getUserId(): string {
    return this.userId;
  }

  public isLocal(): boolean {
    return this.type === "local";
  }

  public isRemote(): boolean {
    return !this.isLocal();
  }

  public setAudioActive(isAudioActive: boolean): void {
    this.audioActive = isAudioActive;
  }

  public setVideoActive(isVideoActive: boolean): void {
    this.videoActive = isVideoActive;
  }

  public setStreamManager(streamManager: StreamManager | null): void {
    this.streamManager = streamManager;
  }

  public setConnectionId(connectionId: string): void {
    this.connectionId = connectionId;
  }

  public setNickname(nickname: string): void {
    this.nickname = nickname;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public setType(type: UserType): void {
    if (type === "local" || type === "remote") {
      this.type = type;
    }
  }
}

export default UserModel;
