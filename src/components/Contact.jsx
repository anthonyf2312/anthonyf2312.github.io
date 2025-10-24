import { useEffect, useState, useRef } from 'react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    // Since GitHub Pages doesn't support server-side processing,
    // we'll show a success message and suggest alternative contact methods
    setStatus({ 
      type: 'success', 
      message: 'Thank you for your message! Please reach out to me on social media for the fastest response.' 
    });
    
    setFormData({ name: '', email: '', message: '' });

    // Clear status after 5 seconds
    setTimeout(() => {
      setStatus({ type: '', message: '' });
    }, 5000);
  };

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      value: 'Contact via form',
      link: '#'
    },
    {
      icon: 'fab fa-instagram',
      title: 'Instagram',
      value: '@dot_wav3',
      link: 'https://instagram.com/dot_wav3'
    },
    {
      icon: 'fab fa-x-twitter',
      title: 'X (Twitter)',
      value: '@AntFleming0',
      link: 'https://x.com/AntFleming0'
    },
  ];

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="section-padding bg-white dark:bg-gray-900"
      aria-label="Contact section"
    >
      <div className="container-custom">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have a project in mind or just want to chat? Feel free to reach out!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="heading-3 mb-6">Let's Connect</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                I'm always open to discussing new projects, creative ideas, or opportunities to collaborate.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    aria-label={`Contact via ${info.title}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <i className={`${info.icon} text-white text-xl`} aria-hidden="true"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{info.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-4">Follow Me</h4>
                <div className="flex gap-4">
                  {[
                    { icon: 'fab fa-instagram', url: 'https://instagram.com/dot_wav3', label: 'Instagram' },
                    { icon: 'fab fa-x-twitter', url: 'https://x.com/AntFleming0', label: 'X' },
                    { icon: 'fab fa-spotify', url: 'https://open.spotify.com/artist/06BgaycqkokqPYneN8qDom', label: 'Spotify' },
                    { icon: 'fab fa-youtube', url: 'https://www.youtube.com/@Dot_WAV3', label: 'YouTube' },
                    { icon: 'fab fa-soundcloud', url: 'https://soundcloud.com/anthony-fleming-753129500', label: 'SoundCloud' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-primary-600 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label={social.label}
                    >
                      <i className={social.icon} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="card p-8" noValidate>
                <h3 className="heading-3 mb-6">Send a Message</h3>

                {/* Status Message */}
                {status.message && (
                  <div 
                    className={`mb-6 p-4 rounded-lg ${
                      status.type === 'success' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                    }`}
                    role="alert"
                  >
                    {status.message}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="Your name"
                      required
                      aria-required="true"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="your.email@example.com"
                      required
                      aria-required="true"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none"
                      placeholder="Your message..."
                      required
                      aria-required="true"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full btn-primary"
                    aria-label="Send message"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
