import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Brightness4, Brightness7, Settings } from '@material-ui/icons';
import { Link } from 'react-router-dom';

interface AppHeaderProps {
  appTheme: boolean;
  handleThemeChange: any;
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const AppHeader = (props: AppHeaderProps) => {
  const classes = useStyles();
  const icon = !props.appTheme ? <Brightness7 /> : <Brightness4 />;

  return (
    // <div className={classes.root}>
    <AppBar position="static" color={props.appTheme ? 'default' : 'primary'}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" className={classes.title}>
          Mapx
        </Typography>
        <IconButton
          aria-label="toggle theme"
          onClick={props.handleThemeChange}
          color="inherit"
        >
          {icon}
        </IconButton>
        <IconButton
          component={Link}
          to="/settings"
          aria-label="settings"
          color="inherit"
        >
          <Settings />
        </IconButton>
      </Toolbar>
    </AppBar>
    // </div>
  );
};

export default AppHeader;
