import { useState, useCallback, useEffect } from 'react';
import { ReplaysManager } from '../lib/storage/replays-manager';
import { RoomReplay, ReplayRoomState } from '../types/replay';
import { onReplaysUpdated } from '../lib/events';

export const useReplays = () => {
	const replaysManager = new ReplaysManager();

	const [replays, setReplays] = useState<RoomReplay[]>(() =>
		replaysManager.getReplays()
	);

	const refreshReplays = useCallback(() => {
		setReplays(replaysManager.getReplays());
	}, []);

	const updateRoomState = useCallback((roomId: string, state: ReplayRoomState) => {
		replaysManager.setRoomState(roomId, state);
		refreshReplays();
	}, [refreshReplays]);

	const clearAllReplays = useCallback(() => {
		replaysManager.clearReplays();
		setReplays([]);
	}, []);

	useEffect(() => {
		const removeReplaysListener = onReplaysUpdated((updatedReplays) => {
			setReplays([...updatedReplays]);
		});

		return () => {
			removeReplaysListener();
		};
	}, [replaysManager]);

	return {
		replays,
		updateRoomState,
		clearAllReplays
	};
};