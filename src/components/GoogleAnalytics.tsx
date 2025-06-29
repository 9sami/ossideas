import { useEffect } from 'react';

const GoogleTag = () => {
  useEffect(() => {
    // Load the gtag.js script
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-KNSTLFTPSP';
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag when the script is loaded
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-KNSTLFTPSP');
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null; // No visual output
};

export default GoogleTag;
