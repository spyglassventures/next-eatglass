// Add this to your global.d.ts file (or the same file where you declare NodeJS)
// /src/types/global.d.ts

declare module NodeJS {
    interface Require {
        context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => {
            keys: () => string[];
            (id: string): any;
        };
    }
}

// Extend the Window interface to include dataLayer
declare global {
    interface Window {
        dataLayer: any[];
    }
}
