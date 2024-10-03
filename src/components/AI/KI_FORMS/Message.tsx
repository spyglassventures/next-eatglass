// Message.tsx


const FormatMessageContent = ({ content }) => {
    return content.split('**').map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
};

const Message = ({ message }) => (
    <div key={message.id} className='mr-6 whitespace-pre-wrap md:mr-12 p-2'>
        {message.role === 'user' && (
            <div className='flex gap-3 relative right-0 justify-end'>
                <div className='bg-blue-100 dark:bg-blue-900 p-3 rounded-md'>
                    <p className='font-semibold text-blue-800 dark:text-blue-300'>Ihre Eingabe:</p>
                    <div className='mt-1.5 text-sm text-blue-700 dark:text-blue-200'>
                        <FormatMessageContent content={message.content} />
                    </div>
                </div>
            </div>
        )}
        {message.role === 'assistant' && (
            <div className='flex gap-3'>
                <div className='w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                    <div className='flex justify-between'>
                        <p className='font-semibold text-green-800 dark:text-green-300'>Copilot</p>
                    </div>
                    <div className='mt-2 text-sm text-green-700 dark:text-green-200'>
                        <FormatMessageContent content={message.content} />
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default Message;
