import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full pt-20">
        <div className="space-y-2">
          <h1 className="text-[12vw] leading-[0.85] font-bold tracking-tight">
            <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Hi. I'm</span>
            <span className="block animate-fade-in-up text-gray-400 dark:text-gray-600" style={{ animationDelay: '0.3s' }}>Anthony.</span>
          </h1>
          <div className="h-4 md:h-8"></div>
          <h2 className="text-[5vw] md:text-[4vw] leading-[0.9] font-bold tracking-tight max-w-4xl">
            <span className="block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              I build <span className="text-indigo-500">digital experiences</span>
            </span>
            <span className="block animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              and make <span className="text-indigo-500">music</span>.
            </span>
          </h2>
        </div>

        <div className="absolute bottom-12 left-6 animate-bounce">
          <ChevronDown size={32} className="text-gray-400" />
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default Hero;
