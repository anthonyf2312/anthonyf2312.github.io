import React from 'react';
import { Terminal, MessageSquare, Github, Activity } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';
import ScrollReveal from '../ScrollReveal';

const About = () => {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-8">
            <Terminal size={32} aria-hidden="true" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Let's create something awesome.</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            I'm currently focused on building Graphene, but I'm always open to discussing new ideas, music collaborations, or just chatting about the latest in tech.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 mb-24">
                                                                        <a href="https://discord.com/invite/ycJmKVqety" className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-lg transition-all hover:scale-105" aria-label="Join Discord community">
                                                                          <SiDiscord size={20} className="group-hover:-mt-1 transition-all" aria-hidden="true" />
                                                                          Discord
                                                                        </a>            <a href="https://github.com/GrapheneBot/GrapheneDiscordBot" className="flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-gray-200 dark:border-gray-800 font-bold text-lg hover:border-indigo-500 hover:text-indigo-500 transition-colors duration-500" aria-label="View GitHub profile">
              <Github size={20} aria-hidden="true" />
              GitHub
            </a>          </div>
        </ScrollReveal>

        {/* Subtle Awareness Section */}
        <ScrollReveal delay={200}>
          <div className="py-12 px-8 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                <Activity size={20} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Beyond the Screen</h3>
              <p className="max-w-2xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic">
                "I navigate life with <span className="text-gray-900 dark:text-white not-italic">Relapsing-Remitting Multiple Sclerosis (RRMS)</span>.
                It is a part of my journey that teaches me resilience and the importance of balance.
                While it doesn't define my work, it shapes the perspective I bring to every challenge."
              </p>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default About;
