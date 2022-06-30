import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';
import {
  CircularProgress, LinearProgress, makeStyles, Typography,
} from '@material-ui/core';
import socketIOClient from 'socket.io-client';
import { deleteMovie } from '../../actions/rating.actions';

const ENDPOINT = window.location.href;

const useStyles = makeStyles({
  poster: {
    maxWidth: 170,
  },
});
const TableRating = ({
  movies, isLoading, deleteMovie, formValues, settings, message,
}) => {
  const classes = useStyles();
  const renderImage = (value, meta, update) => (
    <>
      <img src={value} className={classes.poster} alt="poster" />
    </>
  );
  const [response, setResponse] = useState('');
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('FromAPI', (data) => {
      setResponse(data);
    });
    socket.on('Progress', (data) => {
      setProgress(Number(data));
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const loadingComponent = (
    <>
      <div style={{
        position: 'absolute', zIndex: 110, top: 5, left: 0, width: '100%', height: '99%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(28,28,28,0.8)',
      }}
      >
        <CircularProgress size={24} />
        <br />
        <Typography component="h5" variant="h5">
          {message}
        </Typography>
        <Typography paragraph>{response}</Typography>
      </div>
    </>
  );
  const on = (rows) => {
    deleteMovie(rows, settings);
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
    {
      name: 'Genre',
      label: 'Genre',
      options: {
        filter: true,
        display: false,
        sort: true,
        download: false,
        print: false,
        customBodyRender: (value) => (
          <>
            {value && value.join(', ')}
          </>
        ),
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
      <LinearProgress variant="determinate" value={progress} />
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
  message: state.rating.message,
  isLoading: state.rating.isLoading,
  settings: state.settings,
});

export default connect(mapStateToProps, { deleteMovie })(TableRating);
