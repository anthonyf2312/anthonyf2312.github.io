import { useEffect, useState, useRef } from 'react';

const About = () => {
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

  const skills = [
    { name: 'Music Production', icon: 'fas fa-music', level: 85 },
    { name: 'Sound Design', icon: 'fas fa-headphones', level: 80 },
    { name: 'Mixing & Mastering', icon: 'fas fa-sliders', level: 75 },
    { name: 'Discord Bot Dev', icon: 'fab fa-discord', level: 88 },
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="section-padding bg-white dark:bg-gray-900"
      aria-label="About section"
    >
      <div className="container-custom">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              About <span className="text-gradient">Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Description */}
            <div>
              <h3 className="heading-3 mb-6">Just Making Sounds I Love</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Hey! I'm Ant, and music production is my passion and hobby. I love experimenting 
                with different sounds, creating beats, and bringing my creative ideas to life. 
                What started as a fun hobby has turned into something I genuinely can't live without.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                When I'm not making music, you'll probably find me coding Discord bots, 
                exploring new production techniques, or just vibing to other artists' work. 
                I'm all about learning, experimenting, and having fun with what I create.
              </p>
              
              {/* Fun Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    <i className="fas fa-mug-hot"></i>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fueled by Coffee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    <i className="fas fa-code"></i>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Also Loves Coding</div>
                </div>
              </div>
            </div>

            {/* Right Side - Skills */}
            <div>
              <h3 className="heading-3 mb-6">What I'm Into</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="transition-all duration-500"
                    style={{ 
                      transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(20px)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <i className={`${skill.icon} text-primary-600 dark:text-primary-400`} aria-hidden="true"></i>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary-600 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: isVisible ? `${skill.level}%` : '0%' }}
                        role="progressbar"
                        aria-valuenow={skill.level}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`${skill.name} skill level: ${skill.level}%`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
