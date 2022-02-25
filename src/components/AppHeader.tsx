import React, { useEffect, useState } from 'react';
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
import { SpinningCircles } from 'react-loading-icons';
import ProfileSources from '../pages/ProfileSources';
import { request } from '../Request';

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

const sendUrl = (url: string) => {
  return request(url);
};

const AppHeader = (props: AppHeaderProps) => {
  const [usersData, usersLoaded] = useOktaUsers();
  const classes = useStyles();
  const [userId, setUserId] = useState<any>();
  const [profileSources] = ProfileSources(0);
  const [
    listOfAppsAssignedToUser,
    setListOfAppsAssignedToUser,
  ] = React.useState<any>([]);
  const [appsLoaded, setAppsLoaded] = useState<any>(false);
  const [nodeId, setNodeId] = useState<any>('');

  // console.log(profileSources);
  const icon = !props.appTheme ? <Brightness7 /> : <Brightness4 />;

  useEffect(() => {}, [userId]);

  // useEffect(() => {
  //   getListOfAppsAssignedToUser();
  //   checkForProfileSourceAssignedToUser();
  // }, [userId]);

  let history = useHistory();

  const redirect = (userId: any) => {
    history.push(`/mappings/${userId}/${nodeId}`);
  };

  // const getListOfAppsAssignedToUser = () => {
  //   sendUrl(
  //     `/api/v1/apps?filter=user.id+eq+"${userId}"&expand=user/${userId}`
  //   ).then((response) => {
  //     const appsList = response!.data;
  //     //       console.log(response!.data);
  //     setListOfAppsAssignedToUser(appsList);
  //     setAppsLoaded(true);
  //   });
  // };

  // const checkForProfileSourceAssignedToUser = () => {
  //   console.log(nodeId);

  //   let profileSourceFound = false;
  //   [...listOfAppsAssignedToUser].map((item) => {
  //     [...profileSources].map((ps) => {
  //       if (item.label === ps.data.label.props.children[0]) {
  //         // console.log('Yes!');
  //         profileSourceFound = true;
  //         console.log(ps.id);
  //         setNodeId(ps.id);
  //       }
  //     });
  //   });
  // };

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
            setUserId(value.id);
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
            >
              {usersLoaded ? '' : <SpinningCircles />}
            </TextField>
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
