"use client";

// hiding
// see /src/components/AI/ModelSelector.tsx and src/components/AI/FilterContext.tsx asrc/components/AI/FilterContext.tsx
// state is passed from button change in mpa, arzt, pro to local storage, then read by FilterContext.tsx, then imported by chat_ component.


import React, { createContext, useContext, useState, useEffect } from "react";

type Filter = "MPA" | "Arzt" | "Pro";

interface FilterContextType {
    activeFilter: Filter;
    setActiveFilter: (filter: Filter) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeFilter, setActiveFilter] = useState<Filter>(() => {
        // Initialize from localStorage or fallback to default
        return (localStorage.getItem("filter") as Filter) || "MPA";
    });

    // Helper function to sync state with localStorage
    const syncWithLocalStorage = () => {
        const savedFilter = localStorage.getItem("filter") as Filter;
        if (savedFilter) {
            setActiveFilter(savedFilter);
        }
    };

    // Initialize filter from localStorage and sync on mount
    useEffect(() => {
        syncWithLocalStorage();
    }, []);

    // Save activeFilter to localStorage whenever it changes
    useEffect(() => {
        console.log("FilterProvider - activeFilter updated:", activeFilter); // Debugging
        localStorage.setItem("filter", activeFilter);
    }, [activeFilter]);

    // Listen for localStorage changes (for cross-tab updates)
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "filter" && event.newValue) {
                console.log("StorageEvent - filter updated:", event.newValue); // Debugging
                setActiveFilter(event.newValue as Filter);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Sync with localStorage on every render (in case of tab switches)
    useEffect(() => {
        syncWithLocalStorage();
    });

    return (
        <FilterContext.Provider value={{ activeFilter, setActiveFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
};
