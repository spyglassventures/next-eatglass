import React from 'react';
import modalConfig from "@/config/modalConfig.json";

const ModalContent = () => {
  const { title, messages } = modalConfig.modalContent;

  return (
    <div className="modal-content bg-white dark:bg-white mb-10 rounded-sm">
      <section className="pt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-3/3">
              <div className="bg-white dark:bg-white p-5">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-900">{title}</h2>
                {messages.map((message, index) => (
                  <p key={index} className="mt-2 text-gray-800 dark:text-gray-800">
                    {message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModalContent;
