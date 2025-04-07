// src/app/intern/ClientPage.tsx

// NAVIGATION

// hiding
// see /src/components/AI/ModelSelector.tsx and src/components/AI/FilterContext.tsx asrc/components/AI/FilterContext.tsx
// state is passed from button change in mpa, arzt, pro to local storage, then read by FilterContext.tsx, then imported by chat_ component.

'use client';
import { useState, useEffect, useRef } from 'react';
import { FilterProvider, useFilter } from '@/components/AI/FilterContext'; // for mpa, arzt, pro mode filter for models and theme
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { MicrophoneIcon, ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { NAV_ITEMS, COMPONENTS, ICONS, getActiveComponent } from '@/config/ai/components';
import { TRANSITION_PROPS } from '@/config/ai/transition';
import { motion } from "framer-motion";
import ComponentTimer from '@/components/AI/ai_utils/ComponentTimer';


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

  // Default for different personas
  const [activeComponent, setActiveComponent] = useState<string | null>(null); // noch nichts gesetzt



  const { activeFilter, setActiveFilter } = useFilter();

  useEffect(() => {
    const storedFilter = localStorage.getItem('user_filter');
    if (storedFilter === 'MPA') setActiveComponent('freitext');
    else if (storedFilter === 'Arzt') setActiveComponent('diagnose');
    else if (storedFilter === 'Pro') setActiveComponent('freitext');
    else setActiveComponent('freitext'); // fallback
  }, []);

  const ActiveComponent = getActiveComponent(activeComponent);
  const [filterState, setFilterState] = useState(activeFilter); // see /src/components/AI/ModelSelector.tsx and src/components/AI/FilterContext.tsx
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null); // empty search in modal magic search
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]); // für Tastatur-Navigation
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    setFilterState(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    console.log('Active Filter in ChatFreitext:', activeFilter);
    setFilterState(activeFilter); // Update local state
  }, [activeFilter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowModal(true);
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // clear from magic menu
  useEffect(() => {
    if (showModal) {
      setSearchQuery(''); // 🔄 Leere das Feld beim Öffnen
      setTimeout(() => {
        inputRef.current?.focus(); // 🎯 Fokus setzen mit kleinem Delay (für sicheres Mounting)
      }, 40);
    }
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      setSearchQuery('');
      setHighlightedIndex(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [showModal]);


  // for magic menu
  const allComponents = Object.keys(COMPONENTS).map(key => ({ key, name: COMPONENTS[key].name }));
  const filteredComponents = allComponents.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));








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
              className={`absolute inset-y-0 left-0 w-1/5 bg-primary rounded-full transition-transform duration-300 ${activeFilter === 'MPA'
                ? 'translate-x-[10%]'
                : activeFilter === 'Arzt'
                  ? 'translate-x-[120%]'
                  : activeFilter === 'Pro'
                    ? 'translate-x-[220%]'
                    : activeComponent === 'Diktat'
                      ? 'translate-x-[100%]'
                      : 'translate-x-[100%]' // fallback (z. B. Suchbutton)
                }`}
            />




            {/* Buttons */}
            <button
              onClick={() => {
                setActiveFilter('MPA');
                setActiveComponent('freitext'); // ⬅️ gewünschte Default MPA-Komponente
              }}
              className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${activeFilter === 'MPA' ? 'text-white' : 'text-gray-800 hover:text-primary-600'
                }`}
            >
              MPA
            </button>
            <button
              onClick={() => {
                setActiveFilter('Arzt');
                setActiveComponent('diagnose'); // ⬅️ gewünschte Default MPA-Komponente
              }}
              className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${activeFilter === 'Arzt' ? 'text-white' : 'text-gray-800 hover:text-primary-600'
                }`}
            >
              Arzt
            </button>
            <button
              onClick={() => {
                setActiveFilter('Pro');
                setActiveComponent('freitext'); // ⬅️ gewünschte Default MPA-Komponente
              }}
              className={`relative z-10 px-3 py-1 text-xs font-medium transition-colors duration-300 ${activeFilter === 'Pro' ? 'text-white' : 'text-gray-800 hover:text-primary-600'
                }`}
            >
              Pro
            </button>
            <button
              onClick={() => setActiveComponent('Diktat')}
              className={`relative z-10 flex items-center gap-1 px-3 py-1 text-xs font-medium transition-colors duration-300 ${activeComponent === 'Diktat' ? 'text-white rounded-full px-3 py-1 shadow-md animate-blink-bg' : 'text-gray-800 hover:text-primary-600'
                }`}
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>



            <button onClick={() => setShowModal(true)} className="relative z-10 flex items-center gap-1 px-3 py-1 text-xs font-medium transition-colors duration-300 text-gray-800 hover:text-primary-600">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </div>




        {showModal && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowModal(false)} // Hintergrund klick → schließt Modal
          >
            <motion.div
              onClick={(e) => e.stopPropagation()} // verhindert Schließen beim Klick ins Modal
              initial={{ height: "2px", opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-lg shadow-xl font-light w-[30rem] max-w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-light">Komponentensuche</h2>
                  <button onClick={() => setShowModal(false)}>
                    <XMarkIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Erklärung */}
                <p className="text-sm text-gray-500 mt-2">
                  Gib einen Begriff ein, um nach einer Komponente zu suchen. Klicke dann auf das gewünschte Ergebnis, um es zu öffnen.
                </p>
                <p className="text-sm text-gray-400 italic mt-1">
                  Du kannst dieses Fenster auch mit <span className="font-medium">Strg + K</span> (Windows) oder <span className="font-medium">⌘ + K</span> (Mac) öffnen. Mit der Pfeiltaste nach unten kannst du durch die Ergebnisse navigieren und mit Enter auswählen.
                </p>


                {/* Suchfeld */}
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full mt-4 p-2 border rounded font-light"
                  placeholder="Komponente suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (filteredComponents.length > 0) {
                        setHighlightedIndex(0);
                        resultRefs.current[0]?.focus();
                      }
                    }
                  }}
                />

                {/* Scrollbarer Bereich mit Animation */}
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{ opacity: 1, maxHeight: 200 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="mt-3 overflow-auto border rounded"
                >
                  {filteredComponents.map(({ key, name }, index) => (
                    <button
                      key={key}
                      ref={(el) => {
                        resultRefs.current[index] = el;
                      }}
                      tabIndex={0}
                      onClick={() => {
                        setActiveComponent(key);
                        setShowModal(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const next = index + 1;
                          if (next < filteredComponents.length) {
                            resultRefs.current[next]?.focus();
                            setHighlightedIndex(next);
                          }
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prev = index - 1;
                          if (prev >= 0) {
                            resultRefs.current[prev]?.focus();
                            setHighlightedIndex(prev);
                          } else {
                            inputRef.current?.focus();
                            setHighlightedIndex(null);
                          }
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          setActiveComponent(key);
                          setShowModal(false);
                        }
                      }}
                      className={`block w-full text-left p-2 font-light hover:bg-gray-100 ${highlightedIndex === index ? 'bg-gray-100' : ''
                        }`}
                    >
                      {name}
                    </button>
                  ))}
                  {filteredComponents.length === 0 && (
                    <p className="text-gray-500 p-2">Keine Treffer</p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}











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

            {/* Module in Entwicklung / Managed Care */}
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
      <section className="pt-5">
        <div className="container mx-auto px-4">
          <div className="text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                {COMPONENTS[activeComponent]?.name || 'Willkommen im internen Bereich'}
              </h2>
              <div className="flex-1 flex justify-center">
                <ComponentTimer
                  componentName={COMPONENTS[activeComponent]?.name}
                  mode={activeFilter}
                />

              </div>
            </div>


            {ActiveComponent && <ActiveComponent />}
            <p className="text-center text-gray-500 text-sm pt-2">
              Testversion – kein Medizinalprodukt. Nicht verwenden für Patientenentscheidungen oder wenn ärztliche Entscheidungen beeinflusst werden könnten. Der Copilot kann Fehler machen. Alle Angaben im Detail kontrollieren, nicht blind kopieren.
            </p>
          </div>
        </div>
      </section>
    </FilterProvider>
  );
}