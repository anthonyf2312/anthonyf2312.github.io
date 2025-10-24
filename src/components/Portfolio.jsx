import { useEffect, useState, useRef } from 'react';

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
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

  const projects = [
    {
      title: 'Spotify',
      category: 'music',
      description: 'Stream my latest tracks and releases',
      icon: 'fab fa-spotify',
      link: 'https://open.spotify.com/artist/06BgaycqkokqPYneN8qDom?si=GMlhSyNrQsa5KxZR8XdOIQ',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'SoundCloud',
      category: 'sound-design',
      description: 'More music, experiments, and WIP tracks',
      icon: 'fab fa-soundcloud',
      link: 'https://soundcloud.com/anthony-fleming-753129500',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'YouTube',
      category: 'creative',
      description: 'Behind the scenes and music videos',
      icon: 'fab fa-youtube',
      link: 'https://www.youtube.com/@Dot_WAV3',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Instagram',
      category: 'creative',
      description: 'Daily updates and studio vibes',
      icon: 'fab fa-instagram',
      link: 'https://instagram.com/dot_wav3',
      color: 'from-pink-500 to-purple-600'
    },
  ];

  const filters = [
    { id: 'all', label: 'All Platforms' },
    { id: 'music', label: 'Music' },
    { id: 'sound-design', label: 'Experiments' },
    { id: 'creative', label: 'Content' },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section 
      id="portfolio" 
      ref={sectionRef}
      className="section-padding bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
      aria-label="Portfolio section"
    >
      <div className="container-custom">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              My <span className="text-gradient">Music</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Check out my tracks and follow my musical journey across different platforms!
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={`Filter by ${filter.label}`}
                aria-pressed={activeFilter === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-8 group hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
                aria-label={`${project.title}: ${project.description}`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${project.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${project.icon} text-3xl text-white`} aria-hidden="true"></i>
                </div>
                
                <h3 className="heading-3 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                
                <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  <span className="mr-2">Listen Now</span>
                  <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true"></i>
                </div>
              </a>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <i className="fas fa-folder-open text-6xl text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true"></i>
              <p className="text-gray-600 dark:text-gray-400">No projects found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
