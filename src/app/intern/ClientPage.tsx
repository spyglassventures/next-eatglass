// src/app/intern/ClientPage.tsx

// NAVIGATION

// hiding
// see /src/components/AI/ModelSelector.tsx and src/components/AI/FilterContext.tsx asrc/components/AI/FilterContext.tsx
// state is passed from button change in mpa, arzt, pro to local storage, then read by FilterContext.tsx, then imported by chat_ component.

'use client';
import { useState, useEffect } from 'react';
import { FilterProvider, useFilter } from '@/components/AI/FilterContext'; // for mpa, arzt, pro mode filter for models and theme
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { NAV_ITEMS, COMPONENTS, ICONS, getActiveComponent } from '@/config/ai/components';
import { TRANSITION_PROPS } from '@/config/ai/transition';
// import { tickerAd } from '@/config/ai/components';

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

  const { activeFilter, setActiveFilter } = useFilter(); // Consumes the filter context
  const ActiveComponent = getActiveComponent(activeComponent);
  const [filterState, setFilterState] = useState(activeFilter); // see /src/components/AI/ModelSelector.tsx and src/components/AI/FilterContext.tsx


  useEffect(() => {
    console.log('Active Filter in ChatFreitext:', activeFilter);
    setFilterState(activeFilter); // Update local state
  }, [activeFilter]);

  const filteredItems = NAV_ITEMS.mainComponents.filter((item) => {
    if (activeFilter === 'MPA') return item.visible_mpa;
    if (activeFilter === 'Arzt') return item.visible_arzt;
    if (activeFilter === 'Pro') return item.visible_pro;
    return false;
  });


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
    <FilterProvider>

      <section className="pb-0">
        <div className="container mx-auto px-4 -mt-16 z-10 relative">
          <div className="relative flex justify-center items-center w-max mx-auto mt-0 mb-2 bg-gray-200 rounded-full p-0.5 shadow-sm">
            {/* Animated Background */}
            <div
              className={`absolute inset-y-0 left-0 w-1/3 bg-primary rounded-full transition-transform duration-300 ${activeFilter === 'MPA' ? 'translate-x-0' : activeFilter === 'Arzt' ? 'translate-x-full' : 'translate-x-[200%]'
                }`}
            ></div>

            {/* Buttons */}
            <button
              onClick={() => setActiveFilter('MPA')}
              className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${activeFilter === 'MPA' ? 'text-white' : 'text-gray-800 hover:text-primary-600'
                }`}
            >
              MPA
            </button>
            <button
              onClick={() => setActiveFilter('Arzt')}
              className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${activeFilter === 'Arzt' ? 'text-white' : 'text-gray-800 hover:text-primary-600'
                }`}
            >
              Arzt
            </button>
            <button
              onClick={() => setActiveFilter('Pro')}
              className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${activeFilter === 'Pro' ? 'text-white' : 'text-gray-800 hover:text-primary-600'
                }`}
            >
              Pro
            </button>
          </div>


        </div>






        {showTicker && (
          // {/* truned off as long as no partner booked it */}
          <div className="container p-0">
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
          {/* <div className="mt-4 flex flex-wrap justify-between gap-2"> */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {filteredItems.map(({ key, name }) => (
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
                      .filter((item) => {
                        if (activeFilter === 'MPA') return item.visible_mpa;
                        if (activeFilter === 'Arzt') return item.visible_arzt;
                        if (activeFilter === 'Pro') return item.visible_pro;
                        return false;
                      })
                      .map(({ key, name }) => {
                        const Icon = ICONS[key]; // Get the icon from ICONS
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
                      .filter((item) => {
                        if (activeFilter === 'MPA') return item.visible_mpa;
                        if (activeFilter === 'Arzt') return item.visible_arzt;
                        if (activeFilter === 'Pro') return item.visible_pro;
                        return false;
                      })
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

            {/* Medien KI */}
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
                      .filter((item) => {
                        if (activeFilter === 'MPA') return item.visible_mpa;
                        if (activeFilter === 'Arzt') return item.visible_arzt;
                        if (activeFilter === 'Pro') return item.visible_pro;
                        return false;
                      })
                      .map(({ key, name }) => (
                        <MenuItem key={key}>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => setActiveComponent(key)}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
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

            {/* Managed Care */}
            <Menu as="div" className="relative inline-block text-left" style={{ flex: '1 1 20%' }}>
              <div>
                <MenuButton className="inline-flex items-center px-4 py-2 text-white bg-gray-400 rounded hover:bg-amber-500 w-full">
                  Module in Entwicklung
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-200" aria-hidden="true" />
                </MenuButton>
              </div>
              <Transition {...TRANSITION_PROPS}>
                <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {NAV_ITEMS.mangedCareDropdown
                      .filter((item) => {
                        if (activeFilter === 'MPA') return item.visible_mpa;
                        if (activeFilter === 'Arzt') return item.visible_arzt;
                        if (activeFilter === 'Pro') return item.visible_pro;
                        return false;
                      })
                      .map(({ key, name }) => (
                        <MenuItem key={key}>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => setActiveComponent(key)}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
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
                      .filter((item) => {
                        if (activeFilter === 'MPA') return item.visible_mpa;
                        if (activeFilter === 'Arzt') return item.visible_arzt;
                        if (activeFilter === 'Pro') return item.visible_pro;
                        return false;
                      })
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
                                {Icon && <Icon className="ml-2 h-5 w-5" aria-hidden="true" />}
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
      </section >

      {/* Component Rendering */}
      < section className="pt-5" >
        <div className="container mx-auto px-4">
          <div className="text-left">
            <h2 className="pl-1 text-2xl font-bold text-black dark:text-white">
              {COMPONENTS[activeComponent]?.name}
            </h2>
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </section >
    </FilterProvider>
  );
}