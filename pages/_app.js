// pages/_app.js
import '../styles/tailwind.css';  // Tailwind CSS
import '../styles/globals.css';   // Your global styles

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
