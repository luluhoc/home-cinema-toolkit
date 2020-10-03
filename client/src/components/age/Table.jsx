import React from 'react';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';
import { CircularProgress, makeStyles } from '@material-ui/core';
import Moment from 'react-moment';
import { deleteMovie } from '../../actions/byage.actions';

const useStyles = makeStyles({
  poster: {
    maxWidth: 170,
  },
});
const TableRating = ({
  movies, isLoading, deleteMovie, formValues,
}) => {
  const classes = useStyles();
  const renderImage = (value, meta, update) => (
    <>
      <img src={value && value[0]?.remoteUrl ? value[0]?.remoteUrl : 'Poster'} className={classes.poster} alt="poster" />
    </>
  );

  const renderDate = (value, meta, update) => (
    <>
      <Moment format="YYYY/MM/DD HH:mm">{value}</Moment>
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
    deleteMovie(rows, formValues);
  };
  const columns = [
    {
      name: 'images',
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
      name: 'added',
      label: 'Added',
      options: {
        filter: true,
        sort: true,
        customBodyRender: renderDate,
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
      {!isLoading ? (
        <MUIDataTable
        title="Movies"
        data={movies}
        columns={columns}
        options={options}
      />
      ) : (
       <MUIDataTable
        title="Movies"
        columns={columns}
        options={options}
      />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  movies: state.byage.movies,
  isLoading: state.byage.isLoading,
  formValues: state?.form?.byage?.values,
});

export default connect(mapStateToProps, { deleteMovie })(TableRating);
