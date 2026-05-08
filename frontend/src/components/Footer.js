import React from 'react';
import { colors } from '../utils/theme';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const footerStyle = {
    backgroundColor: colors.mauve.dark,
    color: colors.white,
    padding: '3rem 2rem 1rem',
    marginTop: 'auto', // Très important pour pousser le footer vers le bas
    width: '100%',
    boxSizing: 'border-box'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    // auto-fit gère la portabilité : 1 colonne sur mobile, 4 sur grand écran
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  };

  const titleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: colors.white,
    borderBottom: `2px solid ${colors.mauve.primary}`,
    paddingBottom: '0.5rem',
    width: 'fit-content'
  };

  // On crée une classe CSS interne pour gérer les hovers qui ne passent pas en style direct
  const hoverStyles = `
    .footer-link:hover { opacity: 1 !important; transform: translateX(5px); }
    .social-icon:hover { transform: translateY(-5px); background-color: ${colors.mauve.light} !important; }
    @media (max-width: 600px) {
      .footer-container { text-align: center; justify-items: center; }
      .footer-section { align-items: center; }
    }
  `;

  const wilayas = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida',
    'Sétif', 'Tizi Ouzou', 'Béjaïa', 'Tlemcen', 'Biskra'
  ];

  return (
    <footer style={footerStyle}>
      {/* Injection des styles de survol et média queries */}
      <style>{hoverStyles}</style>
      
      <div style={containerStyle} className="footer-container">
        
        {/* Section À propos */}
        <div style={sectionStyle} className="footer-section">
          <h3 style={titleStyle}>Shop DZ 🛍️</h3>
          <p style={{ opacity: 0.8, lineHeight: '1.6', fontSize: '0.95rem' }}>
            Votre destination shopping préférée en Algérie. 
            Qualité et rapidité partout dans le pays.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {[<FacebookIcon />, <InstagramIcon />, <TwitterIcon />].map((icon, index) => (
              <div key={index} className="social-icon" style={{
                backgroundColor: colors.mauve.primary,
                color: colors.white,
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Section Liens rapides */}
        <div style={sectionStyle} className="footer-section">
          <h3 style={titleStyle}>Navigation</h3>
          {['Accueil', 'Produits', 'À propos', 'Contact'].map(link => (
            <a key={link} href={`/${link.toLowerCase()}`} className="footer-link" style={{
              color: colors.white,
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'all 0.3s',
              fontSize: '0.9rem'
            }}>
              {link}
            </a>
          ))}
        </div>

        {/* Section Livraison */}
        <div style={sectionStyle} className="footer-section">
          <h3 style={titleStyle}>Livraison 🇩🇿</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
            {wilayas.map(wilaya => (
              <span key={wilaya} style={{ opacity: 0.7, fontSize: '0.85rem' }}>
                • {wilaya}
              </span>
            ))}
          </div>
        </div>

        {/* Section Contact */}
        <div style={sectionStyle} className="footer-section">
          <h3 style={titleStyle}>Contact</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.8, fontSize: '0.9rem' }}>
            <LocationOnIcon fontSize="small" /> <span>Bejaia, Algérie</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.8, fontSize: '0.9rem' }}>
            <PhoneIcon fontSize="small" /> <span>+213 (0) 555 12 34 56</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.8, fontSize: '0.9rem' }}>
            <EmailIcon fontSize="small" /> <span>contact@shopdz.com</span>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: `1px solid rgba(255,255,255,0.1)`,
        opacity: 0.6,
        fontSize: '0.85rem'
      }}>
        © {new Date().getFullYear()} Shop DZ. Made with ❤️ in Algeria.
      </div>
    </footer>
  );
};

export default Footer;