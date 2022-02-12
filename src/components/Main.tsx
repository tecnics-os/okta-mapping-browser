import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
// import Apps from '../pages/Apps';
import Settings from '../pages/Settings';
// import UserProfileMappings from '../pages/ProfileMappings';
import {
  ProfileMappings,
  useProfileSourceLabel,
} from '../pages/ProfileMappings4';
import InitialNodes from '../pages/InitialNodes';
import AppHeader from './AppHeader';
import mappingOfUser from '../pages/MappingOfUser';
// import AppUsers from '../pages/OktaUsersData';
// import useMappingData from '../pages/MappingData';

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
        <Route exact path="/" component={AppHeader} />
        {/* <Route exact path="/" component={useMappingData} /> */}
        <Route
          exact
          path="/mappings/:id1/:id2/:label/:logo"
          component={ProfileMappings}
        />
        <Route exact path="/mappings/:userId" component={mappingOfUser} />
        {/* <Route exact path="/apps" component={Apps} /> */}
        <Route exact path="/settings" component={Settings} />
      </Switch>
    </div>
  );
};

export default Main;
