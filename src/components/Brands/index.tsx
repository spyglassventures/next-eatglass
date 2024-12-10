"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Brand } from "@/types/brand";
import Image from "next/image";
// import brandsData from "./brandsData";
import brandsData from "../../config/brandsData";

// <Image src={imageLight} alt={name} fill className="hidden dark:block" /> // to be added back in line 21

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, image, imageLight, name } = brand;

  return (
    <div className="flex w-1/2 items-center justify-center px-1 py-[15px] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
      <a
        href={href}
        target="_blank"
        rel="nofollow noreferrer"
        className="relative h-10 w-full opacity-70 transition hover:opacity-100 dark:opacity-60 dark:hover:opacity-100"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
          className="block dark:hidden"
        />
        {imageLight && (
          <Image
            src={imageLight}
            alt={name}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
            className="hidden dark:block"
          />
        )}
      </a>
    </div>
  );
};

const Brands = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5, // Adjust this threshold as needed
      }
    );

    const currentSectionRef = sectionRef.current;

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  return (
    <section className="pt-12" ref={sectionRef}>
      <div className="container">
        <div className="flex justify-center">
          <h1 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-[45px]">Unsere Partner</h1>
        </div>
        <div className="-mx-6 flex flex-wrap">
          <div className="w-full px-1">
            <div className={`flex flex-wrap items-center justify-center rounded-sm bg-gray-light px-8 py-8 dark:bg-gray-dark sm:px-10 md:px-[50px] md:py-[40px] xl:p-[50px] 2xl:px-[70px] 2xl:py-[60px] ${isVisible ? 'opacity-100 transition-opacity duration-500 delay-500' : 'opacity-0'}`}>
              {brandsData.map((brand) => (
                <SingleBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
