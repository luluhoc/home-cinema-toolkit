import React, { useMemo, useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  ThemeProvider, createMuiTheme, CssBaseline, useMediaQuery,
} from '@material-ui/core';
import { toast } from 'react-toastify';

import history from '../history';

import 'react-toastify/dist/ReactToastify.css';
import Alert from './layout/Alert';
import Header from './layout/Header';

// Delete by Rating

import DeleteByRating from './rating/Page';

// Settings

import Settings from './settings/Page';
import { getSettings } from '../actions/settings.actions';

import DeleteByAge from './age/Page';

const darkTheme = {
  palette: {
    type: 'dark',
    background: {
      default: '#121212',
    },
    primary: {
      main: '#cb2a21',
    },
  },
  typography: {
    fontFamily: '"Kumbh Sans", serif',
  },
  overrides: {
    MuiOutlinedInput: {
      input: {
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px #071c2b inset',
          WebkitTextFillColor: '#fff',
        },
        '&:-webkit-calendar-picker-indicator': {
          filter: 'invert',
        },
      },
    },
  },
};

const lightTheme = {
  palette: {
    type: 'light',
    primary: {
      main: '#cb2a21',
    },
  },
  typography: {
    fontFamily: '"Kumbh Sans", serif',
  },
  overrides: {
    MuiOutlinedInput: {
      input: {
        '&:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px #071c2b inset',
          WebkitTextFillColor: '#fff',
        },
        '&:-webkit-calendar-picker-indicator': {
          filter: 'invert',
        },
      },
    },
  },
};

toast.configure();

const App = ({ getSettings }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  useEffect(() => {
    getSettings();
  }, [getSettings]);
  const theme = useMemo(
    () => createMuiTheme(
      prefersDarkMode ? darkTheme : lightTheme,
    ),
    [prefersDarkMode],
  );

  return (
    <>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Alert />
          <Header />
          <Switch>
            <Route path="/" exact component={DeleteByRating} />
            <Route path="/age" exact component={DeleteByAge} />
            <Route path="/settings" exact component={Settings} />
          </Switch>
        </ThemeProvider>
      </Router>
    </>
  );
};

export default connect(null, {
  getSettings,
})(App);
