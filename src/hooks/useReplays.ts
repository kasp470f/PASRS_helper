import { useState, useCallback, useEffect } from 'react';
import { ReplaysManager } from '../lib/storage/replays-manager';
import { RoomReplay, ReplayRoomState } from '../types/replay';

export const useReplays = () => {
	const [replays, setReplays] = useState<RoomReplay[]>(() =>
		ReplaysManager.getReplays()
	);

	const refreshReplays = useCallback(() => {
		setReplays(ReplaysManager.getReplays());
	}, []);

	const updateRoomState = useCallback((roomId: string, state: ReplayRoomState) => {
		ReplaysManager.setRoomState(roomId, state);
		refreshReplays();
	}, [refreshReplays]);

	const clearAllReplays = useCallback(() => {
		ReplaysManager.clearReplays();
		setReplays([]);
	}, []);

	useEffect(() => {
		const interval = setInterval(refreshReplays, 1000);
		return () => clearInterval(interval);
	}, [refreshReplays]);

	return {
		replays,
		updateRoomState,
		clearAllReplays
	};
};