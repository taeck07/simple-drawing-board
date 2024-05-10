import { createGlobalStyle } from 'styled-components';
import Home from './pages/home';

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    height: auto;
    min-height: 100vh;
  }
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Home />
    </>
  );
}
