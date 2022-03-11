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
import useAppsData from '../pages/ApplicationData';
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
  // const [listOfApps, setListOfApps] = useState<any>([]);
  const [loadedData, setLoadedData] = useState<any>(false);
  const [appsLoaded, listOfApps] = useAppsData();

  // console.log(listOfApps);
  const appsData: any = [...listOfApps];

  const sendUrl = (url: string) => {
    return request(url);
  };

  const getDefaultUserId = () => {
    sendUrl(`/api/v1/user/types`).then((response) => {
      const defaultId = response!.data[1].id;
      setUserProfileTemplateId(defaultId);
      setLoadedData(true);
    });
  };

  useEffect(() => {
    getDefaultUserId();
    console.log(appsData);
    // useAppsData();
    // getAppsList();
    // getProfileTemplateAndAppIds();
  }, []);

  let history = useHistory();

  const redirect = (id1: any, id2: any, label: any, logo: string) => {
    // console.log(id1, id2, label, logo, 'redirect');
    const logoUrl = encodeURIComponent(logo);
    history.push(`/mappings/${id1}/${id2}/${label}/${logoUrl}`);
  };

  // console.log('hello sai!');

  const pushLogoAndAppNames = () => {
    let apiData: any = [];
    console.log('success');
    // console.log(appsData);
    appsData.forEach((item: any, index: any) => {
      item._embedded.app.features.forEach((feature: any) => {
        if (feature === 'PROFILE_MASTERING') {
          console.log(item.id);
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
                      console.log(item);
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
