import { Box, Container } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import SettingsForm from './SettingsForm';
import { setSettings } from '../../actions/settings.actions';
import Copyright from '../layout/Copyright';

const Page = ({ setSettings }) => {
  const onSubmit = (formValues) => {
    setSettings(formValues);
  };
  return (
    <Container maxWidth="lg" style={{ marginTop: 5 }}>
      <SettingsForm onSubmit={onSubmit} />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>

  );
};

export default connect(null, { setSettings })(Page);
