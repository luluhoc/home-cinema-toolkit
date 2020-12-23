import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { renderField, renderSelect, genres } from '../helpers/formHelpers';
import validate from './validate';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    marginTop: theme.spacing(1),
  },
  genre: {
    marginTop: theme.spacing(1),
  },
}));

const RatingForm = ({
  change, handleSubmit, onSubmit, initialize,
}) => {
  const classes = useStyles();
  useEffect(() => {
    initialize({
      genre: 'None',
    });
  }, [initialize]);
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field name="desiredRating" type="number" id="desiredRating" label="Desired Rating" autoFocus component={renderField} />
          <Field
            name="genre"
            id="genre"
            label="Genre"
            className={classes.genre}
            autoFocus
            component={renderSelect}
            options={
            genres.map((e) => <option key={e} value={e}>{e}</option>)
          }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Search
          </Button>
        </form>
      </div>
    </>
  );
};

RatingForm.propTypes = {
  change: PropTypes.func.isRequired,
};

const redForm = reduxForm({
  form: 'rating',
  validate,
  destroyOnUnmount: false,
})(RatingForm);

export default connect(null)(redForm);
