import Link from 'next/link';
import lageplanConfig from "@/config/lageplanConfig.json";

export default function Lageplan() {
  return (
    <div className="container">
      <div className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
        <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
          {lageplanConfig.title}
        </h2>
        <div className="mb-12">
          <iframe
            src={lageplanConfig.map.src}
            width={lageplanConfig.map.width}
            height={lageplanConfig.map.height}
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          {lageplanConfig.sections.map((section, index) => (
            <div key={index}>
              <h3 className="mt-4 mb-2 text-xl font-bold text-black dark:text-white">
                {section.title}
              </h3>
              <p className="text-base font-medium text-body-color">
                {section.content}
                {section.link && (
                  <Link href={section.link.href} target="_blank" rel="noopener noreferrer" className={section.link.class}>
                    {section.link.text}
                  </Link>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
