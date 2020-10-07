import { Box, Container } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import Copyright from '../layout/Copyright';
import Table from './Table';
import TaskForm from './TaskForm';

const Tasks = () => {
  const onSubmit = (formValues) => {
    console.log('findMovies');
  };
  return (
    <Container maxWidth="lg" style={{ marginTop: 5 }}>
      <TaskForm onSubmit={onSubmit} />
      <Table />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default connect(null)(Tasks);
