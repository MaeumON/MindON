import { StreamManager } from "openvidu-browser";

type UserType = "remote" | "local";

class UserModel {
  private connectionId: string;
  private audioActive: boolean;
  private videoActive: boolean;
  private screenShareActive: boolean;
  private nickname: string;
  private streamManager: StreamManager | null;
  private type: UserType;

  constructor() {
    this.connectionId = "";
    this.audioActive = true;
    this.videoActive = true;
    this.screenShareActive = false;
    this.nickname = "";
    this.streamManager = null;
    this.type = "local";
  }

  public isAudioActive(): boolean {
    return this.audioActive;
  }

  public isVideoActive(): boolean {
    return this.videoActive;
  }

  public isScreenShareActive(): boolean {
    return this.screenShareActive;
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

  public setScreenShareActive(isScreenShareActive: boolean): void {
    this.screenShareActive = isScreenShareActive;
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

  public setType(type: UserType): void {
    if (type === "local" || type === "remote") {
      this.type = type;
    }
  }
}

export default UserModel;
