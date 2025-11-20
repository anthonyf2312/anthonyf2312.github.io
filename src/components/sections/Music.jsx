import React from 'react';
import { Music as MusicIcon } from 'lucide-react'; // Keep MusicIcon for now, just in case
import ScrollReveal from '../ScrollReveal';
import { SiSpotify } from 'react-icons/si';

const Music = () => {
  return (
    <section id="music" className="py-32 px-6 bg-white dark:bg-[#161616]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-end gap-4 mb-16">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500">Creative Outlet</h3>
            <div className="h-[1px] flex-grow bg-gray-300 dark:bg-gray-800 mb-1.5"></div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <ScrollReveal delay={100}>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                Sonic <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Landscapes.</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                When I'm not writing code, I'm arranging notes. Music production allows me to explore creativity without syntax errors. I focus on ambient electronic and lo-fi beats that help me (and hopefully you) focus.
              </p>
              <div className="flex gap-4">
                <a href="https://open.spotify.com/artist/06BgaycqkokqPYneN8qDom?si=m6LegP9WTiuysorP0dAB5w" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors" aria-label="Listen on Spotify">
                  <SiSpotify size={20} aria-hidden="true" /> Listen on Spotify
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-7 relative">
            <ScrollReveal delay={300}>
              {/* Abstract Visualizer Graphic */}
              <div className="relative aspect-square md:aspect-video bg-gray-100 dark:bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="flex gap-2 items-end h-1/2">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 bg-indigo-500 rounded-t-sm animate-pulse"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDuration: `${0.5 + Math.random()}s`
                      }}
                    ></div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Music;
