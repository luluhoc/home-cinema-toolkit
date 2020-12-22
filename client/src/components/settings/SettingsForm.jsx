import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { renderCheckbox, renderField } from '../helpers/formHelpers';

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

const SettingsForm = ({
  change, handleSubmit, onSubmit, initialize, settings, clear,
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (settings) {
      initialize({
        radarrUrl: settings.radarrUrl,
        radarrApi: settings.radarrApi,
        v3: settings.v3,
        keyOmdb: settings.keyOmdb,
        addExclusion: settings.addExclusion,
        deleteFiles: settings.deleteFiles,
      });
    } else {
      initialize({
        v3: true,
        addExclusion: true,
        deleteFiles: true,
      });
    }
  }, [settings, initialize]);
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field name="radarrUrl" id="radarrUrl" label="Radarr URL" placeholder="https://radarr.domain.com" autoFocus component={renderField} />
          <Field name="radarrApi" id="radarrApi" label="Radarr API" autoFocus component={renderField} />
          <Field name="v3" defaultValue="true" id="v3" label="API v3" autoFocus component={renderCheckbox} />
          <Field name="keyOmdb" id="keyOmdb" label="OMDB Key" autoFocus component={renderField} />
          <Field name="addExclusion" defaultValue="true" id="addExclusion" label="Add Exclusions" autoFocus component={renderCheckbox} />
          <Field name="deleteFiles" defaultValue="true" id="deleteFiles" label="Delete Files" autoFocus component={renderCheckbox} />
          <Button style={{ position: 'relative', right: 0 }} variant="contained" color="primary" onClick={() => { clear(settings); }}>Clear Rating DB</Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Save
          </Button>
        </form>
      </div>
    </>
  );
};

SettingsForm.propTypes = {
  change: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const redForm = reduxForm({
  form: 'settings',
})(SettingsForm);

const mapStateToProps = (state) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(redForm);
