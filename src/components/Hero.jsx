import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialLinks = [
    { 
      icon: 'fab fa-instagram', 
      url: 'https://instagram.com/dot_wav3', 
      label: 'Instagram',
      color: 'hover:text-pink-600'
    },
    { 
      icon: 'fab fa-x-twitter', 
      url: 'https://x.com/AntFleming0', 
      label: 'X (Twitter)',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    { 
      icon: 'fab fa-spotify', 
      url: 'https://open.spotify.com/artist/06BgaycqkokqPYneN8qDom?si=GMlhSyNrQsa5KxZR8XdOIQ', 
      label: 'Spotify',
      color: 'hover:text-green-600'
    },
    { 
      icon: 'fab fa-soundcloud', 
      url: 'https://soundcloud.com/anthony-fleming-753129500', 
      label: 'SoundCloud',
      color: 'hover:text-orange-600'
    },
    { 
      icon: 'fab fa-youtube', 
      url: 'https://www.youtube.com/@Dot_WAV3', 
      label: 'YouTube',
      color: 'hover:text-red-600'
    },
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center section-padding bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"
      aria-label="Hero section"
    >
      <div className="container-custom">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full blur-2xl opacity-50 animate-float"></div>
              <img
                src="/images/Profile-Picture.jpg"
                alt="Ant Fleming"
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl"
                loading="eager"
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="heading-1 mb-4">
            Hi, I'm <span className="text-gradient">Ant Fleming</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Music Producer | Hobbyist Coder | Creative
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Making beats, building Discord bots, and vibing. Check out what I'm working on!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={scrollToContact}
              className="btn-primary"
              aria-label="Get in touch"
            >
              Get In Touch
            </button>
            <a
              href="#projects"
              className="btn-secondary"
              aria-label="View my projects"
            >
              Check Out My Projects
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-3xl md:text-4xl text-gray-700 dark:text-gray-300 ${social.color} transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2`}
                aria-label={social.label}
              >
                <i className={social.icon} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-2xl text-gray-400" aria-hidden="true"></i>
        </div>
      </div>
    </section>
  );
};

export default Hero;
