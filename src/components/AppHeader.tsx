import React, { useEffect } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Brightness4, Brightness7, Settings } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useUsersData } from '../pages/ProfileMappings4';

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
  const usersData = useUsersData();
  const classes = useStyles();
  const icon = !props.appTheme ? <Brightness7 /> : <Brightness4 />;

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
  ];

  useEffect(() => {
    console.log(usersData);
  }, [usersData]);

  console.log(usersData);

  return (
    // <div className={classes.root}>
    <AppBar position="static" color={props.appTheme ? 'default' : 'primary'}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" className={classes.title}>
          Okta Mapping Tool
        </Typography>

        <Autocomplete
          id="combo-box-demo"
          options={top100Films}
          getOptionLabel={(option) => option.title}
          style={{ width: 300, background: 'white', height: 55 }}
          renderInput={(params) => <TextField {...params} label="Combo box" />}
        />

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
