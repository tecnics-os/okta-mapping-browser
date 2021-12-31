import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
// import Apps from '../pages/Apps';
import Settings from '../pages/Settings';
// import UserProfileMappings from '../pages/ProfileMappings';
import ProfileMappings from '../pages/ProfileMappings';
import InitialNodes from '../pages/InitialNodes';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Main = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Switch>
        <Route exact path="/" component={InitialNodes} />
        <Route
          exact
          path="/mappings/:id1/:id2/:label/:logo"
          component={ProfileMappings}
        />
        {/* <Route exact path="/" component={Apps} /> */}
        {/* <Route exact path="/apps" component={Apps} /> */}
        <Route exact path="/settings" component={Settings} />
      </Switch>
    </div>
  );
};

export default Main;
