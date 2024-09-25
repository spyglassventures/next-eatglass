import React from "react";
import videocallConfig from "@/config/videocallConfig.json";
import aboutSectionTwoConfig from "@/config/aboutSectionTwoConfig.json";
import Image from "next/image";
import Link from 'next/link';

const Videocall = () => {
  const { isActive, link, instructions, deactivatedMessage } = videocallConfig;
  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="py-6 md:py-10 lg:py-18">
      <div className="container mx-auto flex flex-col lg:flex-row text-center lg:text-left">
        <div className="lg:w-1/2 lg:pr-8 mb-12 lg:mb-0 flex flex-col justify-between">
          <div className="rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:px-8 xl:p-[55px] flex-grow">
            {isActive ? (
              <>
                <h1 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
                  Videokonferenz mit unserem Praxisteam
                </h1>
                <a
                  href={link}
                  className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-700 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jetzt teilnehmen
                </a>
                <p className="mt-4 text-base font-medium text-body-color">
                  Bitte stellen Sie sicher, dass Ihre Kamera und Ihr Mikrofon eingeschaltet sind, bevor Sie dem Anruf beitreten.
                </p>
              </>
            ) : (
              <h1 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
                {deactivatedMessage}
              </h1>
            )}
          </div>

          {/* Team Members Section */}
          <div className="mt-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:px-8 xl:p-[55px] flex-grow">
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
              Unser Praxisteam
            </h2>
            <div className="relative flex items-center justify-center p-4 bg-gray-100 rounded-md shadow-inner">
              <div className="absolute inset-x-0 top-0 flex justify-between px-4 py-2 bg-gray-800 bg-opacity-75 text-white text-sm rounded-t-md">
                <span>Vorschau</span>
                <span>{today}</span>
              </div>
              <div className="flex justify-center items-center w-full h-full p-4">
                {aboutSectionTwoConfig.team.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-1/5 aspect-square m-1 bg-white rounded-md border border-gray-300 hover:shadow-xl transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={image.src}
                      alt={image.caption}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                    <div className="absolute bottom-0 w-full text-center bg-opacity-50 bg-black text-white py-1 text-xs opacity-0 hover:opacity-100 transition-opacity duration-300">
                      {image.caption}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 px-4 py-2 bg-gray-800 bg-opacity-75 text-white text-sm rounded-b-md flex justify-between">
                <span>Teilnehmer</span>
                <span>{aboutSectionTwoConfig.team.length}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 lg:pl-8 flex-shrink-0">
          <div className="rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:px-8 xl:p-[55px] h-full">
            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
              {instructions.title}
            </h2>
            <div className="text-left">
              {instructions.steps.map((step, index) => (
                <div key={index} className="mb-6">
                  <h3 className="mt-4 mb-2 text-xl font-bold text-black dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-base font-medium text-body-color">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Videocall;
