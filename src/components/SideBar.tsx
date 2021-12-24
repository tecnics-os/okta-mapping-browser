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
// import UserProfileMappings from '../pages/ProfileMappings';
// import ProfileMappings from '../pages/ProfileMappings2';
import { useHistory } from 'react-router-dom';
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

  const [listOfApps, setListOfApps] = useState<any>([]);
  const [loadedData, setLoadedData] = useState<any>(false);

  var appsData: any = [...listOfApps];

  const url =
    'https://dev-67150963.okta.com/api/v1/apps?filter=status eq "ACTIVE"';

  const getApiData = () => {
    axios({
      method: 'get',
      url: `${url}`,
      headers: {
        Authorization: 'SSWS 006D9kXB5XS7Iv3rIvaQSiXkNCiEagJIpAeVjZ2Qj5',
        // Authorization: `SSWS ${process.env.REACT_APP_OKTA_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      let Data = response.data;
      setListOfApps(Data);
      setLoadedData(true);
    });
  };

  useEffect(() => {
    getApiData();
  }, []);

  let history = useHistory();

  const redirect = (id: any, label: any) => {
    // console.log(id, label, 'redirect');
    history.push(`/mappings/${id}/${label}`);
  };

  const pushAppsData = () => {
    let apiData: any = [];
    Object.keys(appsData).forEach((item: any, index: any) => {
      if (index > 2) {
        apiData.push(
          <>
            <Divider />
            <List>
              <ListItem button>
                <ListItemText
                  primary={appsData[index].label}
                  onClick={() => {
                    redirect(appsData[index].id, appsData[index].label);
                  }}
                />
              </ListItem>
            </List>
            <Divider />
          </>
        );
      }
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
          {pushAppsData()}
        </Drawer>
      )}
    </>
  );
};

export default SideBar;
