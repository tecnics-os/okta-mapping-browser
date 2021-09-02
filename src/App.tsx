import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './pages/Home';

export default function App() {
  const [appTheme, setAppTheme] = useState(true);
  const paletteType = appTheme ? 'dark' : 'light';
  const appliedTheme = createTheme({
    palette: {
      type: paletteType,
    },
  });
  const handleThemeChange = () => {
    setAppTheme(!appTheme);
  };

  return (
    <ThemeProvider theme={appliedTheme}>
      <Router>
        <CssBaseline />
        <Home appTheme={appTheme} handleThemeChange={handleThemeChange} />
      </Router>
    </ThemeProvider>
  );
}
