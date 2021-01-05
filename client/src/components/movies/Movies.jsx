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
    <>
      {!isLoading && movies.map((i) => (
        <Movie key={i.rId} i={i} />
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  settings: state.settings,
  movies: state.lib.movies,
  isLoading: state.lib.isLoading,
});

export default connect(mapStateToProps, { getAllMovies })(Page);
