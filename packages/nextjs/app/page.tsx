"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold mb-20">Web3 Certifier</span>
          </h1>
          <p className="text-center text-lg mx-32 min-w-80">
            <span className="max-w-[800px] block m-auto">
              Web3 Certifier empowers organizations to create blockchain-verified exams, while giving individuals the opportunity to showcase their skills through immutable credentials.
            </span>
          </p>
          <p className="text-center text-lg mx-32 min-w-80">
            <span className="max-w-[800px] block m-auto">
              Join the future of professional certification where exam creators and exam-takers connect through our secure, transparent blockchain platform—creating trust in a digital world.            
            </span>
            </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BookOpenIcon className="h-8 w-8 fill-secondary" />
              <p>
                Organize your exams in the{" "}
                <Link href="/organize_exams" passHref className="link">
                  Organize Exams
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore available certifications in the{" "}
                <Link href="/search_exams" passHref className="link">
                  Search Exams
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
