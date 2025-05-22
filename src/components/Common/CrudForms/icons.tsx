import React from "react";


export const focusIcon = (colorClass: string = 'text-blue-500') => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ${colorClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    )
  }

 export const editIcon = (colorClass: string = 'text-green-500') => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ${colorClass}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    )
  }
