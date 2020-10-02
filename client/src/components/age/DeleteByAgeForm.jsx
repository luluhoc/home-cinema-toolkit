import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import DateField from './DateField';

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

const DeleteByAgeForm = ({
  change, handleSubmit, onSubmit, initialize,
}) => {
  const classes = useStyles();
  useEffect(() => {
    initialize({ addExclusion: true, deleteFiles: true });
  }, []);
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field name="beforeDate" id="beforeDate" label="Radarr URL" placeholder="https://radarr.domain.com" autoFocus component={DateField} />
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

DeleteByAgeForm.propTypes = {

};

const redForm = reduxForm({
  form: 'byage',
  destroyOnUnmount: false,
})(DeleteByAgeForm);

export default connect(null)(redForm);
