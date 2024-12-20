const chatThemes = {
    default: {
        section: 'py-1 text-zinc-700 dark:text-zinc-300', // Text for start screen: geben sie bitte ....
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
        stripeEffect: null, // No stripe effect
    },
    dark: {
        section: 'py-1 text-zinc-700 dark:text-zinc-300',
        container: 'bg-gray-800 text-gray-300',
        button: 'bg-gray-700 text-white',
        buttonHover: 'hover:bg-gray-600',
        messageUser: 'bg-gray-700 text-gray-300',
        messageAssistant: 'bg-gray-750 text-gray-300',
        placeholder: 'placeholder:text-gray-500',
        border: 'border border-gray-700',
        input: 'bg-gray-750 text-gray-300',
        fontSize: 'text-sm',
        fontWeight: 'font-light',
        stripeEffect: null, // No stripe effect
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
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        stripeEffect: null, // No stripe effect
    },
    matrix: {
        section: 'py-1 text-green-400 dark:text-green-400',
        container: 'bg-black text-green-400',
        button: 'bg-green-600 text-black',
        buttonHover: 'hover:bg-green-500',
        messageUser: 'bg-gray-800 text-green-300',
        messageAssistant: 'bg-gray-700 text-green-500',
        placeholder: 'placeholder:text-green-600',
        border: 'border border-red',
        input: 'bg-gray-800 text-green-400',
        fontSize: 'text-xs',
        fontWeight: 'font-mono',
        fontFamily: 'font-terminal',
        stripeEffect: null, // No stripe effect
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
        neonGlow: 'shadow-[0_0_10px_rgba(245,66,255,0.8)]',
        stripeEffect: null, // No stripe effect
    },
    gulf: {
        section: 'py-1 text-black dark:text-blue-300',
        container: 'bg-white text-orange-500',
        button: 'bg-orange-600 text-white',
        buttonHover: 'hover:bg-orange-500',
        messageUser: 'bg-white text-black',
        messageAssistant: 'bg-orange-200 text-blue-900',
        placeholder: 'placeholder:text-orange-400',
        border: 'border border-orange-500',
        input: 'bg-orange-300 text-blue-800',
        fontSize: 'text-base',
        fontWeight: 'font-light',
        stripeEffect: 'bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500',
    },
    brumos: {
        section: 'py-1 text-red-700 dark:text-blue-400',
        container: 'bg-white text-blue-700',
        button: 'bg-red-500 text-white',
        buttonHover: 'hover:bg-blue-500',
        messageUser: 'bg-red-200 text-red-800',
        messageAssistant: 'bg-blue-200 text-black',
        placeholder: 'placeholder:text-gray-500',
        border: 'border border-red-500',
        input: 'bg-blue-200 text-red-800',
        fontSize: 'text-base',
        fontWeight: 'font-light',
        stripeEffect: 'bg-gradient-to-r from-white via-red-500 to-blue-500',
    },
    castrol: {
        section: 'py-1 text-green-700 dark:text-red-400',
        container: 'bg-white text-green-700',
        button: 'text-red',
        buttonHover: 'hover:bg-green-500',
        messageUser: 'bg-green-200 text-green-800',
        messageAssistant: 'bg-white text-red-500',
        placeholder: 'placeholder:text-gray-500',
        border: 'border border-green-500',
        input: 'bg-green-200 text-red-800',
        fontSize: 'text-base',
        fontWeight: 'font-light',
        stripeEffect: 'bg-gradient-to-r from-green-500 via-white from-green-400',
    },
    pepsi: {
        section: 'py-1 text-blue-700 dark:text-red-500',
        container: 'bg-white text-blue-700',
        button: 'bg-blue-500 text-white',
        buttonHover: 'hover:bg-red-500',
        messageUser: 'bg-blue-300 text-white',
        messageAssistant: 'bg-red-300 text-blue-900',
        placeholder: 'placeholder:text-gray-500',
        border: 'border border-blue-500',
        input: 'bg-blue-300 text-white',
        fontSize: 'text-base',
        fontWeight: 'font-light',
        stripeEffect: 'bg-gradient-to-r from-blue-500 via-red-500 to-blue-500',
    },
    redbull: {
        section: 'py-1 text-[#121F45] dark:text-[#223971]',
        container: 'bg-[#121F45] text-[#FFC906]',
        button: 'bg-[#CC1E4A] text-white',
        buttonHover: 'hover:bg-[#FFC906]',
        messageUser: 'bg-[#FFC906] text-[#121F45]',
        messageAssistant: 'bg-[#223971] text-[#FFC906]',
        placeholder: 'placeholder:text-gray-500',
        border: 'border border-[#FFC906]',
        input: 'bg-[#223971] text-[#CC1E4A]',
        fontSize: 'text-base',
        fontWeight: 'font-extralight',
        stripeEffect: 'bg-gradient-to-r from-[#CC1E4A] via-[#FFC906] to-[#121F45]',
    },

    martini: {
        section: 'py-1 text-black dark:text-red-500',
        container: 'bg-white text-black',
        button: 'bg-red-500 text-white',
        buttonHover: 'hover:bg-blue-500',
        messageUser: 'bg-blue-100 text-blue-900',
        messageAssistant: 'bg-red-100 text-red-900',
        placeholder: 'placeholder:text-blue-500',
        border: 'border border-green',
        input: 'bg-white text-black',
        fontSize: 'text-sm',
        fontWeight: 'font-extralight',
        stripeEffect: 'bg-gradient-to-r from-blue-500 via-red-500 to-blue-500',
    }
};

export default chatThemes;


// font-thin	100	Very thin font weight
// font-extralight	200	Extra light font weight
// font-light	300	Light font weight


// text-xs	0.75rem	Extra small font size
// text-sm	0.875rem	Small font size
// text-base	1rem	Default/base font size
// text-lg	1.125rem	Large font size
// text-xl	1.25rem	Extra large font size