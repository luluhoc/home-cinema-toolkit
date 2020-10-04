import { Box, Container, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Line, Circle } from 'rc-progress';
import DeleteByAgeForm from './DeleteByAgeForm';
import Copyright from '../layout/Copyright';
import Table from './Table';
import { findByDate } from '../../actions/byage.actions';

const Page = ({ findByDate, settings }) => {
  const onSubmit = (date) => {
    findByDate(date, settings);
  };
  return (
    <Container maxWidth="lg" style={{ marginTop: 5 }}>
      <Typography>Free Space</Typography>
      <Line percent="50" strokeWidth="1" strokeColor="#FF0000" />
      <DeleteByAgeForm onSubmit={onSubmit} />
      <Table />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>

  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps, { findByDate })(Page);
