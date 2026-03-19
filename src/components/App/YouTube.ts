import { MediaPlayerClass } from "dashjs";
import { Player } from "./Player";

export class YouTube implements Player {
  churuYTPlayer: YT.Player | null;
  constructor(churuYTPlayer: YT.Player | null) {
    this.churuYTPlayer = churuYTPlayer;
  }
  clearDashState = () => {};
  setDashState = (player: MediaPlayerClass) => {};

  getCurrentTime = () => {
    return this.churuYTPlayer?.getCurrentTime() ?? 0;
  };

  getDuration = () => {
    return this.churuYTPlayer?.getDuration() ?? 0;
  };

  isMuted = () => {
    return this.churuYTPlayer?.isMuted() ?? false;
  };

  isSubtitled = (): boolean => {
    // This actually isn't accurate after subtitles have been toggled off because track doesn't update
    // try {
    //   const current = this.churuYTPlayer?.getOption('captions', 'track');
    //   return Boolean(current && current.languageCode);
    // } catch (e) {
    //   console.warn(e);
    //   return false;
    // }
    return false;
  };

  getPlaybackRate = (): number => {
    return this.churuYTPlayer?.getPlaybackRate() ?? 1;
  };

  setPlaybackRate = (rate: number) => {
    this.churuYTPlayer?.setPlaybackRate(rate);
  };

  setSrcAndTime = async (src: string, time: number) => {
    let url = new window.URL(src);
    // Standard link https://www.youtube.com/watch?v=ID
    let videoId = new URLSearchParams(url.search).get("v");
    // Link shortener https://youtu.be/ID
    let altVideoId = src.split("/").slice(-1)[0].split("?")[0];
    this.churuYTPlayer?.cueVideoById(videoId || altVideoId, time);
    // this.churuYTPlayer?.cuePlaylist({listType: 'playlist', list: 'OLAK5uy_mtoaOGQksRdPbwlNtQ9IiK67wir5QqyIc'});
  };

  playVideo = async () => {
    setTimeout(() => {
      console.log("play yt");
      this.churuYTPlayer?.playVideo();
    }, 200);
  };

  pauseVideo = () => {
    this.churuYTPlayer?.pauseVideo();
  };

  seekVideo = (time: number) => {
    this.churuYTPlayer?.seekTo(time, true);
  };

  shouldPlay = () => {
    return (
      this.churuYTPlayer?.getPlayerState() === window.YT?.PlayerState.PAUSED ||
      this.getCurrentTime() === this.getDuration()
    );
  };

  setMute = (muted: boolean) => {
    if (muted) {
      this.churuYTPlayer?.mute();
    } else {
      this.churuYTPlayer?.unMute();
    }
  };

  setVolume = (volume: number) => {
    this.churuYTPlayer?.setVolume(volume * 100);
  };

  getVolume = (): number => {
    const volume = this.churuYTPlayer?.getVolume();
    return (volume ?? 0) / 100;
  };

  setSubtitleMode = (mode?: TextTrackMode, lang?: string) => {
    // Show the available options
    // console.log(this.churuYTPlayer?.getOptions('captions'));
    if (mode === "showing") {
      console.log(lang);
      //@ts-expect-error
      this.churuYTPlayer?.setOption("captions", "reload", true);
      //@ts-expect-error
      this.churuYTPlayer?.setOption("captions", "track", {
        languageCode: lang ?? "en",
      });
    }
    if (mode === "hidden") {
      // BUG this doesn't actually set the value of track
      // so we can't determine if subtitles are on or off
      // need to provide separate menu options
      //@ts-expect-error
      this.churuYTPlayer?.setOption("captions", "track", {});
    }
  };

  getSubtitleMode = () => {
    return "hidden" as TextTrackMode;
  };

  isReady = () => {
    return Boolean(this.churuYTPlayer);
  };

  stopVideo = () => {
    this.churuYTPlayer?.stopVideo();
  };

  clearState = () => {
    return;
  };

  loadSubtitles = async (src: string) => {
    return;
  };

  syncSubtitles = (sharerTime: number) => {
    return;
  };

  getTimeRanges = (): { start: number; end: number }[] => {
    return [
      {
        start: 0,
        end:
          (this.churuYTPlayer?.getVideoLoadedFraction() ?? 0) *
          this.getDuration(),
      },
    ];
  };

  setLoop = (loop: boolean): void => {
    this.churuYTPlayer?.setLoop(loop);
  };

  getVideoEl = (): HTMLMediaElement => {
    return document.getElementById("leftYt") as HTMLMediaElement;
  };
}
