import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import { Box } from '@material-ui/core';
import logo from './logo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: 'none',
  },
  logo: {
    flexGrow: 1,
  },
  button: {
    fontWeight: 700,
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Box component={Link} to="/">
            <img src={logo} width={60} alt="Logo" />
          </Box>
          <div className={classes.logo} />
          <Button className={classes.button} color="inherit" to="/" component={Link}>Rating</Button>
          <Button className={classes.button} color="inherit" to="/tasks" component={Link}>Tasks</Button>
          <Button className={classes.button} color="inherit" to="/age" component={Link}>By Age</Button>
          {/* <Button className={classes.button} color="inherit" to="/movies" component={Link}>Lib</Button> */}
          <IconButton aria-label="delete" color="inherit" to="/settings" component={Link}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
