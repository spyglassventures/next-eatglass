// next-kappelihof/src/components/PraeparatSearchForm.tsx
import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci'

export default function PraeparatSearchForm() {
    const [praeparat, setPraeparat] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchUrl = `https://www.xn--spezialittenliste-yqb.ch/ShowPreparations.aspx?searchType=Preparations&searchValue=${encodeURIComponent(praeparat)}`;
        window.open(searchUrl, '_blank');
    };

    return (
        <form onSubmit={handleSearch} className='mb-4'>
            <label className='block font-semibold font-medium text-zinc-900 dark:text-zinc-100'>
                Präparat:
            </label>
            <div className='flex mt-1'>
                <input
                    type='text'
                    value={praeparat}
                    onChange={(e) => setPraeparat(e.target.value)}
                    className='w-full p-2 border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md'
                    placeholder='Präparatname -> Limitatio einsehen'
                />
                <button
                    type='submit'
                    className='ml-2 h-10 bg-emerald-500 text-white px-4 rounded flex items-center justify-center'
                >
                    <CiSearch className='text-yellow-500' /> SL
                </button>
            </div>
        </form>
    );
}
