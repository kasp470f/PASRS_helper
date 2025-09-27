export interface RoomReplay {
	id: string;
	state: ReplayRoomState;
	url: string;
	format?: string;
	p1: string;
	p2: string;
}

export enum ReplayRoomState {
	Initialized = "initialized",
	Ignored = "ignored",
	OnGoing = "ongoing",
	Finished = "finished",
	Recorded = "recorded", // try to phase out
}