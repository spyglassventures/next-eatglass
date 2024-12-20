import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

const FollowUpButtons = ({ setInput, handlePopEffect, followupBtn }) => (
    <div className='flex justify-start mt-3 space-x-3'>
        {followupBtn.map((btnText, index) => (
            <button
                key={index}
                className='bg-gray-200 text-black px-4 py-2 rounded cursor-pointer flex items-center space-x-2'
                onClick={() => {
                    setInput(btnText);
                    handlePopEffect();
                }}
            >
                <FaLightbulb className='text-yellow-500' />
                <span>{btnText}</span>
            </button>
        ))}
    </div>
);

export default FollowUpButtons;
