import { useEffect, useState, useRef } from 'react';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    { icon: 'fas fa-shield-alt', title: 'Moderation Tools', desc: 'Warn, mute, ban, kick, purge & more' },
    { icon: 'fas fa-chart-line', title: 'Leveling System', desc: 'XP tracking, leaderboards & level roles' },
    { icon: 'fas fa-coins', title: 'Economy System', desc: 'Daily rewards, work commands & bank' },
    { icon: 'fas fa-ticket-alt', title: 'Support Tickets', desc: 'Private support channels with transcripts' },
    { icon: 'fas fa-user-tag', title: 'Role Management', desc: 'Auto-roles & reaction role buttons' },
    { icon: 'fas fa-globe', title: 'Web Dashboard', desc: 'Modern glassmorphism UI for settings' },
  ];

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="section-padding bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
      aria-label="Projects section"
    >
      <div className="container-custom">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Current <span className="text-gradient">Projects</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto rounded-full mb-8"></div>
          </div>

          {/* Main Project Card */}
          <div className="max-w-5xl mx-auto">
            <div className="card p-8 md:p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-600/10 to-purple-600/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-600/10 to-primary-600/10 rounded-full blur-3xl -z-10"></div>

              {/* Header */}
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <i className="fab fa-discord text-4xl text-white" aria-hidden="true"></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="heading-3">Sapphire Discord Bot</h3>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    A powerful, feature-rich Discord bot built with Sapphire Framework, Discord.js v14, and a modern Next.js dashboard.
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                I'm currently working on a multipurpose Discord bot that brings comprehensive server management, 
                moderation tools, leveling, economy, tickets, and more - all wrapped in a sleek web dashboard with 
                glassmorphism design. It's built with modern technologies and uses Discord V2 Components for the 
                best user experience.
              </p>

              {/* Features Grid */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-6 text-gray-800 dark:text-gray-200">Key Features</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      style={{ 
                        transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <i className={`${feature.icon} text-white`} aria-hidden="true"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{feature.title}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Tech Stack</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Discord.js v14',
                    'Sapphire Framework',
                    'Next.js 14',
                    'MongoDB',
                    'Redis',
                    'Tailwind CSS',
                    'Docker'
                  ].map((tech, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  <i className="fas fa-code mr-2" aria-hidden="true"></i>
                  Built with passion and lots of coffee ☕
                </p>
                <div className="flex gap-3">
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                    aria-label="GitHub repository coming soon"
                  >
                    <i className="fab fa-github mr-2" aria-hidden="true"></i>
                    View on GitHub (Soon)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Note */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay tuned for updates! I'm working hard to bring this project to life. 
              It's been an amazing learning experience combining my love for coding and Discord communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
