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
import { request } from '../Request';
import { ListItemIcon } from '@material-ui/core';
interface SideBarProps {
  open: any;
  toggleDrawer: any;
}

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
    left: '0px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    top: '48px',
    left: '0px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)}px + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(9)} + 1px)`,
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

  // console.log(listOfApps);
  const appsData: any = [...listOfApps];

  const sendUrl = (url: string) => {
    return request(url);
  };

  // const getProfileTemplateAndAppIds = () => {
  //   let baseUrl = `/api/v1/user/types`;
  //   axios
  //     .all([
  //       sendUrl(baseUrl),
  //       sendUrl(`/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`),
  //     ])
  //     .then(
  //       axios.spread((...responses) => {
  //         const responseOne = responses[0];
  //         const responseTwo = responses[1];
  //         const defaultId = responseOne!.data[0].id;
  //         const appData = responseTwo!.data;
  //         setUserProfileTemplateId(defaultId);
  //         setListOfApps(appData);
  //         setLoadedData(true);
  //       })
  //     )
  //     .catch((errors) => {
  //       console.error(errors);
  //     });
  // };

  const getDefaultUserId = () => {
    sendUrl(`/api/v1/user/types`).then((response) => {
      const defaultId = response!.data[1].id;
      setUserProfileTemplateId(defaultId);
      setLoadedData(true);
    });
  };

  const getAppsList = () => {
    sendUrl(`/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`).then(
      (response) => {
        const appData = response!.data;
        if (appData.length === 20) {
          showMoreApps(appData);
        } else {
          setListOfApps(appData);
        }
      }
    );
  };

  const showMoreApps = (data: any) => {
    // console.log(data);
    // let moreApps: Array<[]>;
    let flag = false;
    if (data.length % 20 === 0) {
      sendUrl(
        `/api/v1/apps/user/types?expand=app%2CappLogo&after=${
          data[data.length - 1]._embedded.app.id
        }&filter=apps&expand=app%2CappLogo`
      ).then((response) => {
        // moreApps = moreApps.concat(response!.data);
        data = [...data, ...(response!.data ? response!.data : [])];
        showMoreApps(data);
      });
    } else {
      flag = true;
    }
    if (flag) {
      setListOfApps(data);
    }
  };
  // console.log(listOfApps);

  useEffect(() => {
    getDefaultUserId();
    getAppsList();
    // getProfileTemplateAndAppIds();
  }, []);

  let history = useHistory();

  const redirect = (id1: any, id2: any, label: any, logo: string) => {
    // console.log(id1, id2, label, logo, 'redirect');
    const logoUrl = encodeURIComponent(logo);
    history.push(`/mappings/${id1}/${id2}/${label}/${logoUrl}`);
  };

  const pushLogoAndAppNames = () => {
    let apiData: any = [];
    console.log('success');
    // console.log(appsData);
    appsData.forEach((item: any, index: any) => {
      item._embedded.app.features.forEach((feature: any) => {
        if (feature === 'PROFILE_MASTERING') {
          apiData.push(
            <div key={index}>
              <Divider />
              <List>
                <ListItem button key={item.displayName}>
                  <ListItemIcon>
                    <img
                      style={{
                        position: 'sticky',
                        left: '1px',
                        top: '0px',
                      }}
                      className="appLogo"
                      height="17px"
                      width="auto"
                      src={item._embedded.appLogo.href}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={item.displayName}
                    onClick={() => {
                      redirect(
                        userProfileTemplateId,
                        item._embedded.app.id,
                        item.displayName,
                        item._embedded.appLogo.href
                      );
                      console.log('clicked');
                    }}
                  />
                </ListItem>
              </List>
              <Divider />
            </div>
          );
        }
      });
    });

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
            <IconButton onClick={props.toggleDrawer}>
              {props.open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          {pushLogoAndAppNames()}
        </Drawer>
      )}
    </>
  );
};

export default SideBar;
