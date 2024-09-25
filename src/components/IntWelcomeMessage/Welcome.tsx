import React, { useState } from 'react';
import WelcomeMessage from '@/components/IntWelcomeMessage/WelcomeMessage';

const WelcomePage = ({ setActiveComponent }) => {  // Accept setActiveComponent as a prop
    const [isMessageVisible, setIsMessageVisible] = useState(true);

    const handleDismiss = () => {
        setIsMessageVisible(false);
    };

    const handleComplete = () => {
        setIsMessageVisible(false);
        setActiveComponent('diagnose');  // Set the active component to 'diagnose'
    };

    return (
        <div className="welcome-page-container p-8">
            {isMessageVisible && (
                <WelcomeMessage
                    onDismiss={handleDismiss}
                    onComplete={handleComplete}
                    step={1}  // Start at the first step
                />
            )}
        </div>
    );
};

export default WelcomePage;
