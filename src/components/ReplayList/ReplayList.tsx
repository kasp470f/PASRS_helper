import { ReplayCard } from "../ui/ReplayCard/ReplayCard";
import { useReplays } from "../../hooks/useReplays";
import './ReplayList.scss';
import { ReplayRoomState } from "../../types/replay";

const ReplayList = () => {
	const { replays, clearAllReplays } = useReplays();
	var shownReplays = replays.filter(replay => replay.state !== ReplayRoomState.Ignored);

	return (
		<section className="replay-container">
			<div className="replay-header">
				<h3>Replay List</h3>
			</div>

			<section className="replays">
				<section className="replay-list">
					{shownReplays.length === 0 ? (
						<p>No replays available</p>
					) : (
						shownReplays.map((replay) => (
							<ReplayCard roomReplay={replay} />
						))
					)}
				</section>

				<footer className="replay-footer" onClick={clearAllReplays}>
					<p>Clear All Replays</p>
				</footer>
			</section>
		</section>
	)
}

export default ReplayList;