import '../styles/common.scss';
import Settings from './Settings/Settings';

const App = () => {
	return (
		<div className='pasrs-app'>
			<header>
				<h1>PASRS Helper</h1>
				<h2>A tool to help record your replays for faster processing of PASRS</h2>
			</header>
			<section className='content'>
				<section className='replay-section'>

				</section>
				<section className='settings-section'>
					<Settings />
				</section>
			</section>
		</div>
	);
};

export default App;
