import { ReplayCard } from "../ui/ReplayCard/ReplayCard";
import { useReplays } from "../../hooks/useReplays";
import './ReplayList.scss';

const ReplayList = () => {
	const { replays, clearAllReplays } = useReplays();

	return (
		<section className="replay-container">
			<div className="replay-header">
				<h3>Replay List</h3>
			</div>

			<section className="replay-list">
				{replays.length === 0 ? (
					<p>No replays available</p>
				) : (
					replays.map((replay) => (
						<ReplayCard roomReplay={replay} />
					))
				)}

				<footer className="replay-footer" onClick={clearAllReplays}>
					<p>Clear All Replays</p>
				</footer>
			</section>
		</section>
	)
}

export default ReplayList;