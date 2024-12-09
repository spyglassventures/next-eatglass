// src/app/intern/ClientPage.tsx

// NAVIGATION

'use client';
import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { NAV_ITEMS, COMPONENTS, ICONS, getActiveComponent } from '@/config/ai/components';
import { TRANSITION_PROPS } from '@/config/ai/transition';
import { tickerAd } from '@/config/ai/components';

import './styles.css'; // Styles for sponsored news

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// For google Tag Manager
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function ClientPage() {
  const [activeComponent, setActiveComponent] = useState('diagnose');
  const ActiveComponent = getActiveComponent(activeComponent);

  const getButtonClass = (component) => {
    return activeComponent === component ? 'bg-gray-500 text-white' : 'bg-gray-400 text-white hover:bg-amber-500';
  };

  const [showTicker, setShowTicker] = useState(true);

  useEffect(() => {
    // Check if window.dataLayer exists and log accordingly
    if (window.dataLayer) {
      console.log('Pushing component change to dataLayer:', activeComponent);
      window.dataLayer.push({
        event: 'component_change',
        component: activeComponent,
      });
    } else {
      console.warn('dataLayer is not available on the window object.');
    }
  }, [activeComponent]);



  return (
    <>
      <section className="pb-3">
        {showTicker && (
          // {/* truned off as long as no partner booked it */}
          <div className="container p-3">
            {/* <div className="ticker-ad rounded shadow-lg relative">
              <div className="ticker-wrapper">
                
                <div className="ticker-content">{tickerAd}</div>
              </div>
              <button onClick={() => setShowTicker(false)} className="close-button absolute right-2 top-1/2 transform -translate-y-1/2">
                &times;
              </button>
            </div> */}
          </div>
        )}


        <div className="container mx-auto px-4">
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            {NAV_ITEMS.mainComponents
              .filter(item => item.visible)
              .map(({ key, name }) => (
                <button
                  key={key}
                  onClick={() => setActiveComponent(key)}
                  className={`px-4 py-2 rounded ${getButtonClass(key)}`}
                  style={{ flex: '1 1 20%' }}
                >
                  {name}
                </button>
              ))}

            <Menu as="div" className="relative inline-block text-left" style={{ flex: '1 1 20%' }}>
              <div>
                <MenuButton className="inline-flex items-center px-4 py-2 text-white bg-gray-400 rounded hover:bg-amber-500 w-full">
                  ⚕️ Tools
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-200" aria-hidden="true" />
                </MenuButton>
              </div>
              <Transition {...TRANSITION_PROPS}>
                <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {NAV_ITEMS.toolsDropdown
                      .filter(item => item.visible)
                      .map(({ key, name }) => {
                        const Icon = ICONS[key]; // Get the icon from ICONS
                        return (
                          <MenuItem key={key}>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => setActiveComponent(key)}
                                className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'flex justify-between items-center px-4 py-2 text-sm')}
                              >
                                <span>{name}</span>
                                {Icon && <Icon className="ml-2 h-5 w-5" aria-hidden="true" />} {/* Render the icon if it exists */}
                              </a>
                            )}
                          </MenuItem>
                        );
                      })}
                  </div>
                </MenuItems>

              </Transition>
            </Menu>

            {/* formsDropdown Dropdown */}
            <Menu as="div" className="relative inline-block text-left" style={{ flex: '1 1 20%' }}>
              <div>
                <MenuButton className="inline-flex items-center px-4 py-2 text-white bg-gray-400 rounded hover:bg-amber-500 w-full">
                  KI Formulare
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-200" aria-hidden="true" />
                </MenuButton>
              </div>
              <Transition {...TRANSITION_PROPS}>
                <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {NAV_ITEMS.formsDropdown
                      .filter(item => item.visible)
                      .map(({ key, name }) => (
                        <MenuItem key={key}>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => setActiveComponent(key)}
                              style={{ display: 'block', padding: '10px' }}
                            >
                              {name}
                            </a>
                          )}
                        </MenuItem>
                      ))}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            {/* Repeat for other dropdowns */}
            <Menu as="div" className="relative inline-block text-left" style={{ flex: '1 1 20%' }}>
              <div>
                <MenuButton className="inline-flex items-center px-4 py-2 text-white bg-gray-400 rounded hover:bg-amber-500 w-full">
                  Medien KI
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-200" aria-hidden="true" />
                </MenuButton>
              </div>
              <Transition {...TRANSITION_PROPS}>
                <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {NAV_ITEMS.summariesDropdown
                      .filter(item => item.visible)
                      .map(({ key, name }) => (
                        <MenuItem key={key}>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => setActiveComponent(key)}
                              className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}
                            >
                              {name}
                            </a>
                          )}
                        </MenuItem>
                      ))}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            {/* Interne Dokumente logic */}
            <Menu as="div" className="relative inline-block text-left" style={{ flex: '1 1 20%' }}>
              <div>
                <MenuButton className="inline-flex items-center px-4 py-2 text-white bg-gray-400 rounded hover:bg-amber-500 w-full">
                  Interne Dokumente
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-200" aria-hidden="true" />
                </MenuButton>
              </div>
              <Transition {...TRANSITION_PROPS}>
                <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {NAV_ITEMS.interneDropdown
                      .filter(item => item.visible)
                      .map(({ key, name }) => {
                        const Icon = ICONS[key];
                        return (
                          <MenuItem key={key}>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => setActiveComponent(key)}
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'flex justify-between items-center px-4 py-2 text-sm'
                                )}
                              >
                                <span>{name}</span>
                                <Icon className="ml-2 h-5 w-5" aria-hidden="true" />
                              </a>
                            )}
                          </MenuItem>
                        );
                      })}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

          </div>
        </div>
      </section>

      <section className="pt-5">
        <div className="container mx-auto px-4">
          <div className="text-left">
            <h2 className="pl-1 text-2xl font-bold text-black dark:text-white">
              {COMPONENTS[activeComponent]?.name}
            </h2>
            {ActiveComponent && <ActiveComponent />}
            <p className="text-center text-gray-500 text-sm pt-2">
              Testversion - der Copilot kann Fehler machen. Bitte alle Angaben im Detail kontrollieren und nicht blind kopieren.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}