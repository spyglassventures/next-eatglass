"use client";
import Link from "next/link";
import Modal from '../../components/Modal';
import ModalContent from '../../components/Modalcontent';
import { useState, useEffect } from 'react';
import modalConfig from '@/config/modalConfig.json';
import heroConfig from '@/config/heroConfig.json';

const Hero = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    const checkModalQueryParam = () => {
      const params = new URLSearchParams(window.location.search);
      const showModal = params.get('modal') === 'true';
      setModalOpen(showModal);
    };

    if (modalConfig.isModalEnabled) {
      window.addEventListener('load', checkModalQueryParam);
      window.addEventListener('popstate', checkModalQueryParam);

      checkModalQueryParam();

      return () => {
        window.removeEventListener('load', checkModalQueryParam);
        window.removeEventListener('popstate', checkModalQueryParam);
      };
    }
  }, []);

  const renderBackgroundMedia = () => {
    if (!heroConfig.hero.showBackground) return null;

    if (heroConfig.hero.backgroundMedia?.type === "video") {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src={heroConfig.hero.backgroundMedia.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (heroConfig.hero.backgroundMedia?.type === "image") {
      return (
        <img
          src={heroConfig.hero.backgroundMedia.src}
          alt="Background"
          className="absolute inset-0 object-cover w-full h-full"
        />
      );
    }

    return null;
  };

  return (
    <>
      <section
        id="home"
        className={`relative z-10 overflow-hidden pb-8 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[100px] 2xl:pt-[210px] ${heroConfig.hero.backgroundClass}`}
      >
        {renderBackgroundMedia()}
        {heroConfig.hero.showBackground && <div className="absolute inset-0 bg-white opacity-80 dark:bg-black"></div>}
        <div className="container relative z-10">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  {heroConfig.hero.title}
                </h1>

                {modalConfig.isModalEnabled && (
                  <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} contentLabel="Modal">
                    <ModalContent />
                  </Modal>
                )}

                <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  {heroConfig.hero.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  {/* Anrufen Button */}
                  {heroConfig.hero.callToAction.showCallButton && (
                    <Link
                      href={heroConfig.hero.callToAction.callButton.link}
                      className={`${heroConfig.hero.callToAction.callButton.class} `}
                    >
                      {heroConfig.hero.callToAction.callButton.label}
                    </Link>
                  )}

                  {/* WhatsApp Button */}
                  {heroConfig.hero.callToAction.showWhatsAppChatButton && (
                    <Link
                      href={heroConfig.hero.callToAction.whatsappButton.link}
                      className={`${heroConfig.hero.callToAction.whatsappButton.class} `}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {heroConfig.hero.callToAction.whatsappButton.label}
                    </Link>
                  )}

                  {/* Online Termine Buchen Button */}
                  {heroConfig.hero.callToAction.showOnlineTerminButton && (
                    <Link
                      href={heroConfig.hero.callToAction.onlineBookingButton.link}
                      className={`${heroConfig.hero.callToAction.onlineBookingButton.class} `}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {heroConfig.hero.callToAction.onlineBookingButton.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {heroConfig.hero.svgGradientStops.map((gradient, index) => (
              <defs key={index}>
                <linearGradient id={gradient.id} x1={gradient.x1} y1={gradient.y1} x2={gradient.x2} y2={gradient.y2} gradientUnits="userSpaceOnUse">
                  {gradient.colors.map((color, idx) => (
                    <stop key={idx} offset={color.offset} stopColor={color.stopColor} stopOpacity={color.stopOpacity} />
                  ))}
                </linearGradient>
              </defs>
            ))}
            <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
            <circle cx="17.9997" cy="182" r="18" fill="url(#paint1_radial_25:217)" />
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
