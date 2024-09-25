import Image from "next/image";

const Openinghours = () => {
  return (
    <section className="py-6 md:py-10 lg:py-18">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/about-image-2.svg"
                alt="about image"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/about-image-2-dark.svg"
                alt="about image"
                fill
                className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Öffungszeiten
                </h3>
                <div className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  <p>Mo–Mi: <span className="font-normal">8–12 Uhr und 14–18 Uhr</span></p>
                  <p>Do: <span className="font-normal">8–16 Uhr</span></p>
                  <p>Fr: <span className="font-normal">8–12 Uhr und 13–17 Uhr</span></p>
                </div>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Digitaler Kontakt
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Schreiben Sie uns Ihr Anliegen per E-Mail oder nutzen Sie das Kontaktformular.
                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Berichtswesen
                </h3>
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  Anfragen zu Befunden und Arztbriefen richten Sie bitte an unser Praxisteam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Openinghours;
