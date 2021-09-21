import React, { useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// import Apps from './pages/Apps';
import Home from './pages/Home';
import Apps from './pages/Apps';

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
        <Switch>
          <Route path="/">
            <Apps />
          </Route>
        </Switch>
        {/* <Home appTheme={appTheme} handleThemeChange={handleThemeChange} /> */}
      </Router>
    </ThemeProvider>
  );
}
