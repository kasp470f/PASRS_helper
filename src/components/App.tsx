import { useEffect } from 'react';
import '../styles/common.scss';
import ReplayList from './ReplayList/ReplayList';
import Settings from './Settings/Settings';

const App = () => {
    const checkSize = () => {
        const app = document.querySelector('.pasrs-app') as HTMLElement;
        const minWidth = 655; // Minimum width to display both sections side by side

        if (app) {
            const { offsetWidth } = app; // Now TypeScript knows this exists
            if (offsetWidth < minWidth) {
                app.classList.add('single-panel');
            } else {
                app.classList.remove('single-panel');
            }
        }
    };

    useEffect(() => {
        // Check size on mount
        checkSize();

        // Add resize listener to window
        const handleResize = () => checkSize();
        window.addEventListener('resize', handleResize);

        // Cleanup listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='pasrs-app'>
            <header>
                <h1>PASRS Helper</h1>
                <h2>A tool to help record your replays for faster processing of PASRS</h2>
            </header>
            <section className='content'>
                <section className='replay-section'>
                    <ReplayList />
                </section>
                <section className='settings-section'>
                    <Settings />
                </section>
            </section>
        </div>
    );
};

export default App;
