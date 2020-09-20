import React from 'react';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';
import { CircularProgress, makeStyles } from '@material-ui/core';

import { deleteMovie } from '../../actions/rating.actions';

const useStyles = makeStyles({
  poster: {
    maxWidth: 170,
  },
});
const TableRating = ({
  movies, isLoading, deleteMovie,
}) => {
  const classes = useStyles();
  const renderImage = (value, meta, update) => (
    <>
      <img src={value} className={classes.poster} alt="poster" />
    </>
  );
  const loadingComponent = (
    <div style={{
      position: 'absolute', zIndex: 110, top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(28,28,28,0.8)',
    }}
    >
      <CircularProgress size={24} />
    </div>
  );
  const on = (rows) => {
    deleteMovie(rows);
  };
  const columns = [
    {
      name: 'Poster',
      label: 'Poster',
      options: {
        filter: false,
        sort: false,
        customBodyRender: renderImage,
        download: false,
        print: false,
      },
    },
    {
      name: 'title',
      label: 'Title',
      options: {
        filter: true,
        sort: true,
        download: false,
        print: false,
      },
    },
    {
      name: 'imdbVotes',
      label: 'Votes',
      options: {
        filter: true,
        sort: true,
        download: false,
        print: false,
      },
    },
    {
      name: 'imdbRating',
      label: 'Rating',
      options: {
        filter: true,
        sort: true,
        download: false,
        print: false,
      },
    },

  ];

  const options = {
    filterType: 'dropdown',
    filter: false,
    download: false,
    print: false,
    onRowsDelete: (rows) => { on(rows); },
  };

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && loadingComponent}
      <MUIDataTable
        title="Movies"
        data={movies}
        columns={columns}
        options={options}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  movies: state.rating.movies,
  isLoading: state.rating.isLoading,
});

export default connect(mapStateToProps, { deleteMovie })(TableRating);
