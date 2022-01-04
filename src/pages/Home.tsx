import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import AppHeader from '../components/AppHeader';
import FixedIconMenu from '../components/FixedIconMenu';
import SideBar from '../components/SideBar';
import Main from '../components/Main';

interface HomeProps {
  appTheme: boolean;
  handleThemeChange: any;
}
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    flexDirection: 'column',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
const Home = (props: HomeProps) => {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const classes = useStyles();
  return (
    <>
      <AppHeader
        appTheme={props.appTheme}
        handleThemeChange={props.handleThemeChange}
      />
      <Grid container className={classes.root}>
        {/* <Grid item>
          <FixedIconMenu onClickAppsIcon={handleDrawerOpen} />
        </Grid> */}
        <Grid item>
          <SideBar open={open} toggleDrawer={toggleDrawer} />
        </Grid>
        <Grid item>
          <Main />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
