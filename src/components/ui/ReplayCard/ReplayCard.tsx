import { RoomReplay } from "../../../types/replay";
import './ReplayCard.scss';

interface ReplayCardProps {
	roomReplay: RoomReplay;
}

export const ReplayCard: React.FC<ReplayCardProps> = ({ roomReplay }) => {
	return (
		<div className="replay-card" onClick={() => copyToClipboard(roomReplay.url)}>
			<section className="replay-info">
				<span className="replay-format">{roomReplay?.format}</span>
				<span className="replay-players">
					{roomReplay.p1} vs {roomReplay.p2}
				</span>
			</section>

			<div className="replay-actions">
				<span className="replay-state">{roomReplay.state}</span>
				<i className="fa fa-clipboard" aria-hidden="true"></i>
			</div>
		</div>
	);
}

const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text).catch((err) => {
		console.error('Failed to copy text to clipboard:', err);
	});
}