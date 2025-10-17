import '../styles/globals.css';
import SEO from '../components/SEO';

export default function App({ Component, pageProps }) {
  return (
    <>
      <SEO />
      {/* Hidden alternate brand name for search engines: "Diagnose Me" */}
      <span style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}} aria-hidden="true">Diagnose Me</span>
      <Component {...pageProps} />
    </>
  );
}
