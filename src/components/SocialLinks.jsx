import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebook,
  faXTwitter,
  faLinkedin,
  faPinterest,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const SocialLinks = ({ className = '' }) => {
  const socials = [
    { icon: faInstagram, href: 'https://instagram.com/jacques_photographer', label: 'Instagram' },
    { icon: faFacebook, href: 'https://facebook.com/KeddyJacques', label: 'Facebook' },
    { icon: faXTwitter, href: 'https://x.com/jacques_photographer', label: 'Twitter' },
    { icon: faPinterest, href: 'https://pinterest.com/jacques_photographer', label: 'Pinterest' },
    { icon: faYoutube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          aria-label={social.label}
        >
          <FontAwesomeIcon icon={social.icon} className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
