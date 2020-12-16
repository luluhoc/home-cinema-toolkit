import { Box, Container } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import SettingsForm from './SettingsForm';
import { setSettings } from '../../actions/settings.actions';
import { clearDB } from '../../actions/rating.actions';
import Copyright from '../layout/Copyright';

const Page = ({ setSettings, clearDB }) => {
  const onSubmit = (formValues) => {
    setSettings(formValues);
  };

  const clear = (settings) => {
    clearDB(settings);
  };
  return (
    <Container maxWidth="lg" style={{ marginTop: 5 }}>
      <SettingsForm onSubmit={onSubmit} clear={clear} />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>

  );
};

export default connect(null, { setSettings, clearDB })(Page);
