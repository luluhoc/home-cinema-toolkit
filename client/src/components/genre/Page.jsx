import { Box, Container } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import GenreForm from './GenreForm';
import Table from './Table';
import { findMovies } from '../../actions/rating.actions';
import Copyright from '../layout/Copyright';

const Page = ({ findMovies, settings }) => {
  const onSubmit = (formValues) => {
    console.log('findMovies');
    findMovies(formValues, settings);
  };
  return (
    <Container maxWidth="lg" style={{ marginTop: 5 }}>
      <GenreForm onSubmit={onSubmit} />
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

export default connect(mapStateToProps, { findMovies })(Page);
