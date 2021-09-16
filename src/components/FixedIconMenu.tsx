import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';

interface FixedIconMenuProps {
  onClickAppsIcon: any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    maxWidth: 64,
    backgroundColor: theme.palette.background.paper,
    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
  },
}));

const FixedIconMenu = (props: FixedIconMenuProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <Link to="/apps">
          <ListItem button onClick={props.onClickAppsIcon}>
            <ListItemIcon>
              <BookmarkIcon />
            </ListItemIcon>
          </ListItem>
        </Link>
        <Link to="/settings">
          <ListItem button>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
          </ListItem>
        </Link>
      </List>
      <Divider />
    </div>
  );
};

export default FixedIconMenu;
