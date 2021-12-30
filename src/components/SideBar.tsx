import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { useHistory } from 'react-router-dom';
import { WS_OKTA_API_TOKEN_KEY, WS_OKTA_BASE_URL_KEY } from '../constants';
import { request } from '../Request';
interface SideBarProps {
  open: boolean;
  handleDrawerClose: any;
}

const apiKey = localStorage.getItem(WS_OKTA_API_TOKEN_KEY);
const baseUrl = localStorage.getItem(WS_OKTA_BASE_URL_KEY);
// console.log('ws', apiKey);

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    top: '48px',
    left: '64px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    top: '48px',
    left: '64px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    [theme.breakpoints.up('sm')]: {
      width: 0,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const SideBar = (props: SideBarProps) => {
  dotenv.config();
  const classes = useStyles();
  const theme = useTheme();

  const [userProfileTemplateId, setUserProfileTemplateId] = useState<any>('');
  const [listOfApps, setListOfApps] = useState<any>([]);
  const [loadedData, setLoadedData] = useState<any>(false);

  const appsData: any = [...listOfApps];

  // const userProfileTemplateUrl = `https://dev-67150963.okta.com/api/v1/user/types`;
  // const appNamesUrl = `https://dev-67150963.okta.com/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`;

  const userProfileTemplateUrl = `${baseUrl}/api/v1/user/types`;
  const appNamesUrl = `${baseUrl}/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`;

  const sendUrl = (url: string) => {
    // return axios({
    //   method: 'get',
    //   url: `${url}`,
    //   headers: {
    //     // Authorization: 'SSWS 00qgXvmjAIJpwx87gOeiUuHLS_zEBFeIX8omqyUTIN',
    //     Authorization: `SSWS ${apiKey}`,
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // });
    request(`/api/v1/user/types`).then((response) => {
      console.log(response);
    });
  };

  // const getProfileTemplateAndAppIds = () => {
  //   axios
  //     .all([sendUrl(userProfileTemplateUrl), sendUrl(appNamesUrl)])
  //     .then(
  //       axios.spread((...responses) => {
  //         let responseOne = responses[0];
  //         let responseTwo = responses[1];
  //         let defaultId = responseOne.data[0].id;
  //         let appData = responseTwo.data;
  //         setUserProfileTemplateId(defaultId);
  //         setListOfApps(appData);
  //         setLoadedData(true);
  //       })
  //     )
  //     .catch((errors) => {
  //       console.error(errors);
  //     });
  // };

  // const getApiData = () => {
  //   axios({
  //     method: 'get',
  //     url: `${url}`,
  //     headers: {
  //       // Authorization: 'SSWS 00qgXvmjAIJpwx87gOeiUuHLS_zEBFeIX8omqyUTIN',
  //       // Authorization: `SSWS ${apiKey}`,
  //       Authorization: `SSWS ${process.env.REACT_APP_OKTA_TOKEN}`,
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   }).then((response) => {
  //     let Data = response.data;
  //     setListOfApps(Data);
  //     setLoadedData(true);
  //   });
  // };

  useEffect(() => {
    // getProfileTemplateAndAppIds();
    sendUrl(`${baseUrl}/api/v1/user/types`);
  }, []);

  let history = useHistory();

  const redirect = (id1: any, id2: any, label: any, logo: string) => {
    // console.log(id1, id2, label, logo, 'redirect');
    const logoUrl = encodeURIComponent(logo);
    history.push(`/mappings/${id1}/${id2}/${label}/${logoUrl}`);
  };

  const pushAppNames = () => {
    let apiData: any = [];
    Object.keys(appsData).forEach((item: any, index: any) => {
      apiData.push(
        <>
          <Divider />
          <List>
            <ListItem button>
              <img
                style={{
                  position: 'sticky',
                  left: '1px',
                  top: '0px',
                }}
                className="appLogo"
                height="12px"
                width="auto"
                src={appsData[index]._embedded.appLogo.href}
              />
              <ListItemText
                primary={appsData[index].displayName}
                onClick={() => {
                  redirect(
                    userProfileTemplateId,
                    appsData[index].id,
                    appsData[index].displayName,
                    appsData[index]._embedded.appLogo.href
                  );
                }}
              />
            </ListItem>
          </List>
          <Divider />
        </>
      );
    });
    // setAppsList(apiData);
    return apiData;
  };

  return (
    <>
      {loadedData && (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: props.open,
            [classes.drawerClose]: !props.open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: props.open,
              [classes.drawerClose]: !props.open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={props.handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          {pushAppNames()}
        </Drawer>
      )}
    </>
  );
};

export default SideBar;
