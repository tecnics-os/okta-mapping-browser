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
interface SideBarProps {
  open: boolean;
  handleDrawerClose: any;
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

  const sendUrl = (url: string) => {
    return request(url);
  };

  const getProfileTemplateAndAppIds = () => {
    let baseUrl = `/api/v1/user/types`;
    axios
      .all([
        sendUrl(baseUrl),
        sendUrl(`/api/v1/apps/user/types?expand=app%2CappLogo&category=apps`),
      ])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const defaultId = responseOne!.data[0].id;
          const appData = responseTwo!.data;
          setUserProfileTemplateId(defaultId);
          setListOfApps(appData);
          setLoadedData(true);
        })
      )
      .catch((errors) => {
        console.error(errors);
      });
  };

  useEffect(() => {
    getProfileTemplateAndAppIds();
  }, []);

  let history = useHistory();

  const redirect = (id1: any, id2: any, label: any, logo: string) => {
    // console.log(id1, id2, label, logo, 'redirect');
    const logoUrl = encodeURIComponent(logo);
    history.push(`/mappings/${id1}/${id2}/${label}/${logoUrl}`);
  };

  const pushAppNames = () => {
    let apiData: any = [];
    appsData.forEach((item: any, index: any) => {
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
                src={item._embedded.appLogo.href}
              />
              <ListItemText
                primary={item.displayName}
                onClick={() => {
                  redirect(
                    userProfileTemplateId,
                    item.id,
                    item.displayName,
                    item._embedded.appLogo.href
                  );
                }}
              />
            </ListItem>
          </List>
          <Divider />
        </>
      );
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
