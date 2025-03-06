"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export const SearchBar = ({ setSearchTerm }: { setSearchTerm: any }) => {
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    return (
        <Box className="w-full flex items-center justify-start mx-5">
            <input
                className="border-2 border-neutral bg-base-100 text-base-content p-2 mr-2 sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
                type="text"
                value={searchInput}
                placeholder="Search name/description/attributes"
                onChange={e => setSearchInput(e.target.value)}
            />
            <button
                className="border-2 border-neutral h-10 btn btn-sm btn-primary hover:border-accent"
                onClick={handleSearch}
            >
                <MagnifyingGlassIcon className="mt-5 h-[22px] w-[22px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </button>
            <div className="pl-5"></div>
        </Box>
    );
};