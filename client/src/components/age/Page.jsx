import { Box, Container } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import DeleteByAgeForm from './DeleteByAgeForm';
import Copyright from '../layout/Copyright';

const Page = () => {
  const onSubmit = (formValues) => {

  };
  return (
    <Container maxWidth="lg" style={{ marginTop: 5 }}>
      <DeleteByAgeForm onSubmit={onSubmit} />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>

  );
};

export default connect(null)(Page);
