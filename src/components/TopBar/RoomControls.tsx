import React, { useState } from "react";
import { ActionIcon, Button } from "@mantine/core";
import { Socket } from "socket.io-client";
import { People } from "../People/People";
import {
  IconMicrophone,
  IconPhoneCall,
  IconPhoneOff,
  IconVideo,
} from "@tabler/icons-react";

export const RoomControls = (props: {
  socket: Socket;
  participants: User[];
  nameMap: StringDict;
  pictureMap: StringDict;
  localId: string;
}) => {
  const [wantMic, setWantMic] = useState(true);
  const [wantVideo, setWantVideo] = useState(false);

  const handleJoinVideo = async () => {
    // Create black canvas fallback
    const black = ({ width = 640, height = 480 } = {}) => {
      const canvas: any = Object.assign(document.createElement("canvas"), {
        width,
        height,
      });
      canvas.getContext("2d")?.fillRect(0, 0, width, height);
      const stream = canvas.captureStream();
      return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };
    let stream = new MediaStream([black()]);

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: wantVideo,
      });
    } catch (e) {
      console.warn(e);
      try {
        console.log("attempt audio only stream");
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      } catch (e) {
        console.warn(e);
      }
    }

    // Apply pre-join preferences
    if (!wantMic && stream.getAudioTracks()[0]) {
      stream.getAudioTracks()[0].enabled = false;
    }
    if (!wantVideo && stream.getVideoTracks()[0]) {
      stream.getVideoTracks()[0].enabled = false;
    }

    window.churu.ourStream = stream;
    props.socket.emit("CMD:joinVideo");
    props.socket.emit("CMD:userMute", { isMuted: !wantMic });
  };

  const handleLeaveVideo = () => {
    const ourStream = window.churu.ourStream;
    const videoPCs = window.churu.videoPCs;
    ourStream?.getTracks().forEach((track) => track.stop());
    window.churu.ourStream = undefined;
    Object.keys(videoPCs).forEach((key) => {
      videoPCs[key].close();
      delete videoPCs[key];
    });
    props.socket.emit("CMD:leaveVideo");
  };

  const handleToggleMic = (localInVideo: boolean) => {
    const next = !wantMic;
    setWantMic(next);
    if (localInVideo) {
      const ourStream = window.churu.ourStream;
      if (ourStream?.getAudioTracks()[0]) {
        ourStream.getAudioTracks()[0].enabled = next;
      }
      props.socket.emit("CMD:userMute", { isMuted: !next });
    }
  };

  const handleToggleVideo = (localInVideo: boolean) => {
    const next = !wantVideo;
    setWantVideo(next);
    if (localInVideo) {
      const ourStream = window.churu.ourStream;
      if (ourStream?.getVideoTracks()[0]) {
        ourStream.getVideoTracks()[0].enabled = next;
      }
    }
  };

  const others = props.participants.filter((p) => p.id !== props.localId);
  const videoChat = others.filter((p) => p.isVideoChat);
  const notVideoChat = others.filter((p) => !p.isVideoChat);
  const hasNonVideo = notVideoChat.length > 0;
  const hasVideo = videoChat.length > 0;
  const separator = (
    <div
      style={{
        width: 1,
        height: 30,
        backgroundColor: "#555",
        margin: "0 4px",
        flexShrink: 0,
      }}
    />
  );
  const localInVideo = props.participants.some(
    (p) => p.id === props.localId && p.isVideoChat,
  );

  return (
    <>
      {hasNonVideo && (
        <>
          <People
            participants={notVideoChat}
            nameMap={props.nameMap}
            pictureMap={props.pictureMap}
          />
        </>
      )}
      {hasNonVideo && separator}
      <div
        style={{
          width: 40,
          height: 40,
          border: "2px solid #17181A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.35,
        }}
      >
        <IconPhoneCall size={22} color="#888" />
      </div>
      <People
        participants={videoChat}
        nameMap={props.nameMap}
        pictureMap={props.pictureMap}
        borderColor="#217531"
      />
      {separator}
      <ActionIcon
        color="#343a40"
        onClick={() => handleToggleMic(localInVideo)}
        title={wantMic ? "Mic on" : "Mic off"}
        style={{ position: "relative", overflow: "visible" }}
      >
        <IconMicrophone size={22} />
        <div
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: wantMic ? "#217531" : "#c53232",
            border: "3px solid #343a40",
          }}
        />
      </ActionIcon>
      <ActionIcon
        color="#343a40"
        onClick={() => handleToggleVideo(localInVideo)}
        title={wantVideo ? "Video on" : "Video off"}
        style={{ position: "relative", overflow: "visible" }}
      >
        <IconVideo size={22} />
        <div
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: wantVideo ? "#217531" : "#c53232",
            border: "3px solid #343a40",
          }}
        />
      </ActionIcon>
      {localInVideo ? (
        <Button
          size="xs"
          color="red"
          onClick={handleLeaveVideo}
          leftSection={<IconPhoneOff size={16} />}
        >
          Leave Voice
        </Button>
      ) : (
        <Button
          size="xs"
          color="#2f9e44"
          onClick={handleJoinVideo}
          leftSection={<IconPhoneCall size={16} />}
        >
          Join Voice
        </Button>
      )}
    </>
  );
};
