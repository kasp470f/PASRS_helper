import { ReplayRoomState, RoomReplay } from "../../../types/replay";
import './ReplayCard.scss';

export const ReplayCard: React.FC<{ roomReplay: RoomReplay }> = ({ roomReplay }) => {
	const isBattleCompleted = (): boolean => {
		return roomReplay.state === ReplayRoomState.Finished || roomReplay.state === ReplayRoomState.Recorded;
	}

	return (
		<div className="replay-card" onClick={() => copyToClipboard(roomReplay.url)}>
			<section className="replay-info">
				<span className="replay-format">{roomReplay?.format}</span>
				<span className="replay-players">
					{roomReplay.p1} vs {roomReplay.p2}
				</span>
			</section>

			<div className="replay-actions">
				<span className="replay-state">
					{isBattleCompleted() ? roomReplay.result : roomReplay.state}
				</span>
				{
					roomReplay.url ? (
						<i className="fa fa-clipboard" aria-hidden="true"></i>
					) : null
				}
			</div>
		</div>
	);
}

const copyToClipboard = (url: string) => {
	if (!url) return;

	navigator.clipboard.writeText(url).catch((err) => {
		console.error('Failed to copy text to clipboard:', err);
	});
}