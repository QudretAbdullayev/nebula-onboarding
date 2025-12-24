import { useState } from 'react';


import '@/App.css'; // We'll keep this for now, but ideally move to component styles

export const LandingPage = () => {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    Vite
                </a>
            </div>
            <h1>Performance Evolution</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    This is the new feature-based structure.
                </p>
            </div>
        </>
    );
};
