import { create } from "zustand";

export const playerData = create((set, get) => ({
	videoSRC: "",
	videoId: "",
	setVideoSRC: (newValue, videoId) =>
		set({ videoSRC: newValue, videoId: videoId }),
}));
