import {
  Box, Container, Grid, makeStyles,
} from '@material-ui/core';
import React, { useEffect, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import Copyright from '../layout/Copyright';
import Movie from './Movie';
import { getAllMovies } from '../../actions/lib.actions';

const Page = ({
  movies, isLoading, getAllMovies, settings,
}) => {
  useEffect(() => {
    getAllMovies(settings);
  }, []);

  return (
    <Container container maxWidth="lg" style={{ marginTop: 10 }}>
      <Movie i={movies} isLoading={isLoading} settings={settings} />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
  movies: state.lib.movies,
  isLoading: state.lib.isLoading,
});

export default connect(mapStateToProps, { getAllMovies })(Page);
