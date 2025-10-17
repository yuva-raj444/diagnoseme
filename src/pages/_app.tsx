import '../styles/globals.css';
import SEO from '../components/SEO';

export default function App({ Component, pageProps }) {
  return (
    <>
      <SEO />
      <Component {...pageProps} />
    </>
  );
}
