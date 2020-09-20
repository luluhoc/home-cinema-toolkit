import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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
}));

const renderField = ({
  input, label, meta, id, autoFocus, autoComplete, type, multiline, rows, min, max,
}) => {
  if (meta.error && meta.touched) {
    return (
      <TextField
        error
        variant="outlined"
        margin="normal"
        required
        fullWidth
        {...input}
        label={label}
        id="outlined-error-helper-text"
        defaultValue="Hello World"
        helperText={meta.error}
        multiline={multiline}
        rows={rows}
      />
    );
  }
  return (
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      {...input}
      id={id}
      label={label}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      type={type}
      multiline={multiline}
      rows={rows}
    />
  );
};

const RatingForm = ({
  change, handleSubmit, title, shortDesc, description, priority, onSubmit,
}) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field name="radarrUrl" value={title} id="radarrUrl" label="Radarr URL" autoFocus component={renderField} />
          <Field name="radarrApi" value={title} id="radarrApi" label="Radarr API" autoFocus component={renderField} />
          <Field name="keyOmdb" value={title} id="keyOmdb" label="OMDB Key" autoFocus component={renderField} />
          <Field name="desiredRating" value={title} type="number" id="desiredRating" label="Desired Rating" autoFocus component={renderField} />
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

};

const redForm = reduxForm({
  form: 'rating',
})(RatingForm);

export default connect(null)(redForm);
