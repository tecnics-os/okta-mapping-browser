import React from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Brightness4, Brightness7 } from '@material-ui/icons';

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
    <div className={classes.root}>
      <AppBar position="static">
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
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppHeader;
