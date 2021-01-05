import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';
import {
  Button,
  CircularProgress, LinearProgress, makeStyles, Switch, Typography,
} from '@material-ui/core';
import { deleteMovie } from '../../actions/rating.actions';
import { whitelist } from '../../actions/lib.actions';

const useStyles = makeStyles({
  poster: {
    maxWidth: 170,
  },
});
const TableRating = ({
  i, isLoading, settings, whitelist,
}) => {
  const classes = useStyles();
  const renderImage = (value, meta, update) => (
    <>
      <img src={value} className={classes.poster} alt="poster" />
    </>
  );

  const renderWhite = (value, meta, update) => (
    <>
      <Switch
        name="checkedA"
        checked={value}
        onChange={whitelist(meta.rowData[6])}
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </>
  );

  const loadingComponent = (
    <>
      <div style={{
        position: 'absolute', zIndex: 110, top: 5, left: 0, width: '100%', height: '99%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(28,28,28,0.8)',
      }}
      >
        <CircularProgress size={24} />
        <br />
        <Typography component="h5" variant="h5">
          Loading
        </Typography>
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
    {
      name: 'whitelist',
      label: 'Whitelist',
      options: {
        filter: false,
        sort: false,
        customBodyRender: renderWhite,
        download: false,
        print: false,
      },
    },
    {
      name: 'rId',
      label: 'rId',
      options: {
        filter: false,
        sort: false,
        display: false,
        customBodyRender: renderWhite,
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
        data={i}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default connect(null, { whitelist })(TableRating);
