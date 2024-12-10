const chatThemes = {
    default: {
        section: 'py-1 text-zinc-700 dark:text-zinc-300',
        container: 'bg-white dark:bg-zinc-900',
        button: 'bg-emerald-500 text-white',
        buttonHover: 'hover:bg-emerald-600',
        messageUser: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        messageAssistant: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        placeholder: 'placeholder:text-zinc-600/75 dark:placeholder:text-zinc-500',
        border: 'border dark:border-zinc-700',
        input: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300',
        fontSize: 'text-base', // Default font size
        fontWeight: 'font-light', // Light font weight for dark mode

    },
    dark: {
        section: 'py-1 text-zinc-700 dark:text-zinc-300',// Slightly lighter text and less harsh background
        container: 'bg-gray-800 text-gray-300', // Container background with reduced contrast
        button: 'bg-gray-700 text-white',
        buttonHover: 'hover:bg-gray-600',
        messageUser: 'bg-gray-700 text-gray-300', // Softer background and text
        messageAssistant: 'bg-gray-750 text-gray-300', // Similar but distinguishable from user messages
        placeholder: 'placeholder:text-gray-500', // Subtle placeholder text
        border: 'border border-gray-700', // Softer border to match the container
        input: 'bg-gray-750 text-gray-300', // Matching input background and text
        fontSize: 'text-sm', // Slightly larger font for readability
        fontWeight: 'font-light', // Lighter font weight for a less heavy feel
    },

    light: {
        section: 'py-1 text-zinc-700 dark:text-zinc-300',
        container: 'bg-white text-gray-800',
        button: 'bg-blue-400 text-white',
        buttonHover: 'hover:bg-blue-500',
        messageUser: 'bg-blue-200 text-blue-900',
        messageAssistant: 'bg-gray-200 text-gray-900',
        placeholder: 'placeholder:text-gray-500',
        border: 'border border-gray-300',
        input: 'bg-gray-200 text-gray-900',
        fontSize: 'text-lg', // Larger font size for light mode
        fontWeight: 'font-medium', // Medium font weight for light mode
    },
    matrix: {
        section: 'py-1 text-green-400 dark:text-green-400',
        container: 'bg-gray-900 text-green-400', // Dark grey background and green text
        button: 'bg-green-600 text-black',
        buttonHover: 'hover:bg-green-500',
        messageUser: 'bg-gray-800 text-green-300', // Slightly lighter background for user messages
        messageAssistant: 'bg-gray-700 text-green-500', // Slightly darker for assistant messages
        placeholder: 'placeholder:text-green-600',
        border: 'border border-green-500',
        input: 'bg-gray-800 text-green-400',
        fontSize: 'text-base', // Keep the font size readable
        fontWeight: 'font-mono', // Terminal-style monospaced font
        fontFamily: 'font-terminal', // Custom font-family for terminal style
    },
    cypherpunk: {
        section: 'py-1 text-purple-400 dark:text-fuchsia-400',
        container: 'bg-black text-fuchsia-300',
        button: 'bg-fuchsia-700 text-black',
        buttonHover: 'hover:bg-purple-700',
        messageUser: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
        messageAssistant: 'bg-gradient-to-r from-purple-700 to-blue-800 text-white',
        placeholder: 'placeholder:text-purple-400',
        border: 'border border-fuchsia-500',
        input: 'bg-black text-fuchsia-300',
        fontSize: 'text-lg',
        fontWeight: 'font-extrabold',
        neonGlow: 'shadow-[0_0_10px_rgba(245,66,255,0.8)]', // Neon glow effect
    },
};

export default chatThemes;
