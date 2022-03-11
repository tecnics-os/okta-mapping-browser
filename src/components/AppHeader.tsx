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
import { CSVLink, CSVDownload } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import { useMappingData } from '../pages/MappingOfUser';

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

// const sendUrl = (url: string) => {
//   return request(url);
// };

const AppHeader = (props: AppHeaderProps) => {
  // const [
  //   profileSource,
  //   profileSourceToOktaKeysArray,
  //   profileSourceToOktaValuesArray,
  //   oktaKeysArray,
  //   oktaValuesArray,
  //   appsArray,
  // ] = useMappingData();

  const [usersData, usersLoaded] = useOktaUsers();
  const classes = useStyles();
  const [userId, setUserId] = useState<any>();
  const [nodeId, setNodeId] = useState<any>('');

  // console.log(profileSources);
  const icon = !props.appTheme ? <Brightness7 /> : <Brightness4 />;

  useEffect(() => {}, [userId]);

  useEffect(() => {}, [nodeId]);

  // useEffect(() => {}, [
  //   profileSource,
  //   profileSourceToOktaKeysArray,
  //   profileSourceToOktaValuesArray,
  //   oktaKeysArray,
  //   oktaValuesArray,
  //   appsArray,
  // ]);

  // console.log(profileSource);
  // useEffect(() => {}, [profileSource]);

  let history = useHistory();

  const redirect = (userId: any, userName: any) => {
    console.log(`/mappings/${userId}/${userName}`);
    history.push(`/mappings/${userId}/${userName}`);
  };

  // const csvData = [
  //   ['firstname', 'lastname', 'email'],
  //   ['Ahmed', 'Tomi', 'ah@smthing.co.com'],
  //   ['Raed', 'Labes', 'rl@smthing.co.com'],
  //   ['Yezzi', 'Min l3b', 'ymin@cocococo.com'],
  // ];

  // const headers = ['Sai', 'Srinivas', 'Pendyala'];

  return (
    // <div className={classes.root}>
    <AppBar position="static" color={props.appTheme ? 'default' : 'primary'}>
      <Toolbar variant="dense" style={{ minHeight: '20px' }}>
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
            // console.log(value.profile.firstName + value.profile.lastName);
            let userName = value.profile.firstName + value.profile.lastName;
            // console.log(value.id);
            setUserId(value.id);
            redirect(value.id, userName);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search User"
              style={{
                width: 320,
                height: 55,
                backgroundColor: props.appTheme ? '#696969' : '#0693e3',
                borderRadius: '3px',
                border: 'red',
                // borderColor: props.appTheme ? '#696969' : 'lightBlue',
              }}
              // color={props.appTheme ? 'blue' : 'green'}
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
          to="/"
          aria-label="settings"
          color="inherit"
        >
          <Settings />
        </IconButton>
        {/* <button onClick={() => history.goBack()}> */}
        <IconButton>
          <ArrowBackIcon onClick={() => history.goBack()}></ArrowBackIcon>
        </IconButton>
        {/* </button> */}
        {/* <IconButton>
          <GetAppIcon>
            <button onClick={() => history.goBack()}>Go Back</button>
          </GetAppIcon>
        </IconButton> */}
        {/* < data={csvData} headers={headers}>
          <IconButton>
            <GetAppIcon></GetAppIcon>
          </IconButton>
        </CSVLink> */}
      </Toolbar>
    </AppBar>
    // </div>
  );
};

export default AppHeader;
