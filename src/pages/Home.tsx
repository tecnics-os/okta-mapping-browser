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
  },
}));
const Home = (props: HomeProps) => {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item>
        <AppHeader
          appTheme={props.appTheme}
          handleThemeChange={props.handleThemeChange}
        />
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item>
            <FixedIconMenu onClickAppsIcon={handleDrawerOpen} />
          </Grid>
          <Grid item>
            <SideBar open={open} handleDrawerClose={handleDrawerClose} />
          </Grid>
          <Grid item>
            <Main />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
