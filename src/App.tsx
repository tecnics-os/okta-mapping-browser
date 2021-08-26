import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { styled, useTheme } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MuiDrawer from '@material-ui/core/Drawer';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { ThemeProvider } from '@emotion/react';
import { Paper } from '@material-ui/core';
import ReactFlow from 'react-flow-renderer';

const drawerWidth = 60;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
}));

function MiniDrawer() {
  const [theme, setTheme] = useState(true);
  const icon = !theme ? <Brightness7Icon /> : <Brightness3Icon />;
  const light = {
    palette: {
      mode: 'light',
    },
  };
  const dark = {
    palette: {
      mode: 'dark',
    },
  };

  const appliedTheme = createTheme(theme ? light : dark);
  return (
    <ThemeProvider theme={appliedTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{
                marginRight: '36px',
              }}
            >
              {/* <img src="../assets/faviconOktaTools.png" alt="okta-tools" /> */}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            <IconButton
              edge="end"
              color="inherit"
              aria-label="mode"
              onClick={() => setTheme(!theme)}
            >
              {icon}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent">
          <DrawerHeader></DrawerHeader>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon sx={{ minWidth: 30, mb: 2 }}>
                <BookmarksIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText />
            </ListItem>

            <ListItem button>
              <ListItemIcon sx={{ minWidth: 30 }}>
                <SettingsIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText />
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            m: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <DrawerHeader />
          <Paper>
            <Box component="form" noValidate sx={{ mt: 1, padding: 8 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="oktatenent"
                label="Okta Tenent"
                name="oktatenent"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="apikey"
                label="API Key"
                id="apikey"
              />
              <Box sx={{ display: 'flex' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3, mb: 2, mr: 2 }}
                >
                  Test
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={MiniDrawer} />
      </Switch>
    </Router>
  );
}
