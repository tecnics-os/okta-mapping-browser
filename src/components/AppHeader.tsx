import React, { useEffect } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Brightness4, Brightness7, Settings } from '@material-ui/icons';
import { Link, Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useOktaUsers from '../pages/OktaUsersData';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useHistory } from 'react-router-dom';
import { useProfileSourceLabel } from '../pages/ProfileMappings4';

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
  const [usersData] = useOktaUsers();
  const classes = useStyles();
  // const [appLabel] = useProfileSourceLabel();
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

  let history = useHistory();

  const redirect = (userId: any) => {
    history.push(`/mappings/${userId}`);
  };

  return (
    // <div className={classes.root}>
    <AppBar position="static" color={props.appTheme ? 'default' : 'primary'}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" className={classes.title}>
          Okta Mapping Tool
        </Typography>

        <Autocomplete
          freeSolo
          id="combo-box-demo"
          disableClearable
          // options={usersData.map(
          //   (user) => `${user.profile.firstName} ${user.profile.lastName}`
          // )}
          options={usersData}
          getOptionLabel={(user: any) =>
            `${user.profile.firstName} ${user.profile.lastName}`
          }
          renderOption={(user: any, { inputValue }) => {
            const matches = match(
              `${user.profile.firstName} ${user.profile.lastName}`,
              inputValue
            );
            const parts = parse(
              `${user.profile.firstName} ${user.profile.lastName}`,
              matches
            );

            return (
              <div>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {/* {`${user.profile.firstName} ${user.profile.lastName}`} */}
                    {part.text}
                  </span>
                ))}
                <br></br>
                <span style={{ fontWeight: 'lighter' }}>
                  {user.profile.email}
                </span>
              </div>
            );
          }}
          onChange={(event, value) => {
            console.log(value.id);
            redirect(value.id);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search User"
              style={{ width: 320 }}
              margin="normal"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
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
