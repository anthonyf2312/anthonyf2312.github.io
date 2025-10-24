const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 section-padding py-12" role="contentinfo">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-4">Ant Fleming</h3>
            <p className="text-gray-400 mb-4">
              Music Producer | Artist | Creative Professional
            </p>
            <p className="text-sm text-gray-500">
              Making beats, building bots, and having fun with it all.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', id: 'home' },
                { label: 'About', id: 'about' },
                { label: 'Projects', id: 'projects' },
                { label: 'Music', id: 'portfolio' },
                { label: 'Contact', id: 'contact' }
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors focus:outline-none focus:text-primary-400"
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
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
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={social.label}
                >
                  <i className={social.icon} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>
            &copy; {currentYear} Ant Fleming. All rights reserved. | Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
