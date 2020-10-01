import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';

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
  input, label, meta, id, autoFocus, autoComplete, type, multiline, rows, min, max, placeholder,
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
        placeholder={placeholder}
        label={label}
        id="outlined-error-helper-text"
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
      placeholder={placeholder}
      label={label}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      type={type}
      multiline={multiline}
      rows={rows}
    />
  );
};

const renderCheckbox = ({
  input, label, meta, id, autoFocus, autoComplete, type, multiline, rows, min, max,
}) => {
  if (meta.error && meta.touched) {
    return (
      <FormControlLabel
        control={<Checkbox {...input} checked={typeof input.value === 'boolean' ? input.value : false} />}
        label={label}
      />
    );
  }
  return (
    <FormControlLabel
      control={<Checkbox {...input} checked={typeof input.value === 'boolean' ? input.value : false} />}
      label={label}
    />
  );
};

const SettingsForm = ({
  change, handleSubmit, onSubmit, initialize, settings,
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (settings) {
      initialize({
        radarrUrl: settings.radarrUrl,

      });
    }
  }, [settings]);
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field name="radarrUrl" id="radarrUrl" label="Radarr URL" placeholder="https://radarr.domain.com" autoFocus component={renderField} />
          <Field name="radarrApi" id="radarrApi" label="Radarr API" autoFocus component={renderField} />
          <Field name="v3" defaultValue="true" id="v3" label="API v3" autoFocus component={renderCheckbox} />
          <Field name="keyOmdb" id="keyOmdb" label="OMDB Key" autoFocus component={renderField} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

SettingsForm.propTypes = {

};

const redForm = reduxForm({
  form: 'settings',
  destroyOnUnmount: false,
})(SettingsForm);

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(redForm);
