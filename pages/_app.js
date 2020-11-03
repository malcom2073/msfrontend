import '../styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
  }
  