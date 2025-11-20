import React from 'react';
import { ExternalLink, Shield, LayoutDashboard, Command, Zap, Github } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const Work = () => {
  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="flex items-end gap-4 mb-16">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500">Selected Work</h3>
            <div className="h-[1px] flex-grow bg-gray-300 dark:bg-gray-800 mb-1.5"></div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="group relative bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl transition-transform duration-500 hover:-translate-y-2">
            <div className="grid md:grid-cols-2 gap-0">

              {/* Project Info */}
              <div className="p-10 md:p-16 flex flex-col justify-center order-2 md:order-1 border-t md:border-t-0 md:border-r border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    CURRENT PROJECT
                  </span>
                  <span className="text-gray-500 text-xs font-mono">v1.0.0</span>
                </div>

                                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors duration-500">Graphene</h2>                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  A powerful discord bot with a sleek monochrome dashboard. Featuring advanced moderation, automation, and economy systems tailored for professional communities.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {[
                    { icon: Shield, label: "Auto-Mod" },
                    { icon: LayoutDashboard, label: "Next.js Dashboard" },
                    { icon: Command, label: "Slash Commands" },
                    { icon: Zap, label: "Automation" }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                            <feature.icon size={16} aria-hidden="true" />
                                            <span className="text-sm font-medium">
                                              {feature.label}
                                            </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-gray-700 rounded-full font-medium cursor-not-allowed" aria-label="Graphene Bot Coming Soon">
                    <Github size={18} aria-hidden="true" /> Coming soon
                  </a>
                                                                                              <a href="https://github.com/GrapheneBot/GrapheneDiscordBot" className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-white/20 rounded-full font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-500" aria-label="View Graphene Bot Documentation on GitHub">
                                                                                                Documentation
                                                                                              </a>                </div>
              </div>

              {/* Visual Representation / Mockup Area */}
              <div className="bg-gray-100 dark:bg-[#0f0f0f] p-10 flex items-center justify-center order-1 md:order-2 min-h-[400px] relative overflow-hidden">
                {/* Abstract Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"
                  style={{ backgroundImage: 'linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* UI Card Mockup */}
                <div className="relative w-full max-w-sm bg-white dark:bg-[#121212] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 transform group-hover:scale-105 transition-transform duration-500 ease-out transition-colors duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">G</div>
                                                  <div>
                                                    <div className="font-bold text-sm text-gray-900 dark:text-white transition-colors duration-500">Graphene Bot</div>
                                                    <div className="text-xs text-gray-500 transition-colors duration-500">Coming soon</div>
                                                  </div>                    </div>
                    <div className="text-xs px-2 py-1 bg-gray-500/20 text-gray-500 rounded font-mono">UNDER DEVELOPMENT</div>
                  </div>

                  <div className="space-y-3 flex flex-col items-center justify-center h-24 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-dashed border-gray-200 dark:border-white/10 mt-4">
                    <span className="text-sm text-gray-400 font-medium">Dashboard Coming Soon</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Work;
