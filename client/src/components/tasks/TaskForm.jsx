import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field, reduxForm, formValueSelector,
} from 'redux-form';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { renderCheckbox, renderField, renderSelect } from '../helpers/formHelpers';

import ByAge from './ByAge';

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

const selector = formValueSelector('tasks');

const TasksForm = ({
  change, handleSubmit, onSubmit, initialize, jobType,
}) => {
  const classes = useStyles();
  const hoursMinutes = (variable) => {
    const hours = [];
    const minutes = [];
    if (variable === 'hours') {
      for (let i = 0; i < 24; i++) {
        hours.push(i);
      }
      return hours;
    }
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }
    return minutes;
  };
  useEffect(() => {
    initialize({
      time: {
        hour: 3,
        minute: 0,
        dayOfWeek: null,
      },
      jobType: 'rating',
      addExclusion: true,
      deleteFiles: true,
    });
  }, [initialize]);
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            name="time[hour]"
            options={hoursMinutes('hours').map((e) => <option key={e} value={e}>{e <= 9 ? `0${e}` : e}</option>)}
            id="hour"
            parse={(value) => Number(value)}
            className={classes.formControl}
            type="number"
            label="Hour"
            placeholder="23"
            autoFocus
            component={renderSelect}
          />
          <Field
            name="time[minute]"
            parse={(value) => Number(value)}
            options={hoursMinutes('minutes').map((e) => <option key={e} value={e}>{e <= 9 ? `0${e}` : e}</option>)}
            id="minute"
            className={classes.formControl}
            type="number"
            label="Minute"
            autoFocus
            component={renderSelect}
          />
          <Field
            name="time[dayOfWeek]"
            className={classes.formControl}
            parse={(value) => JSON.parse(value)}
            options={(
              <>
                <option value="null">Everyday</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </>
          )}
            id="day"
            label="Day"
            autoFocus
            component={renderSelect}
          />
          <Field
            name="jobType"
            className={classes.formControl}
            options={
            (
              <>
                <option value="rating">Rating</option>
                <option value="byAge">Delete By Age</option>
              </>
            )
          }
            id="jobType"
            label="Job Type"
            autoFocus
            component={renderSelect}
          />
          {jobType && jobType === 'rating' ? (
            <>
              <Field name="variable" type="number" id="desiredRating" label="Desired Rating" autoFocus component={renderField} />
              <Field name="addExclusion" defaultValue="true" id="addExclusion" label="Add Exclusions" autoFocus component={renderCheckbox} />
              <Field name="deleteFiles" defaultValue="true" id="deleteFiles" label="Delete Files" autoFocus component={renderCheckbox} />
            </>
          ) : (
            <ByAge Field={Field} change={change} />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Save Job
          </Button>
        </form>
      </div>
    </>
  );
};

TasksForm.propTypes = {
  change: PropTypes.func.isRequired,
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.variable) {
    // only if the user did not enter a title;
    errors.variable = 'You need to enter a value';
  }

  if (formValues.variable) {
    if (isNaN(formValues.variable)) {
      errors.variable = 'Variable must be a number';
    }
  }

  if (formValues.variable) {
    if (formValues.variable < 0 || formValues.variable > 10) {
      errors.variable = 'Desired Rating must be in range 0 to 10';
    }
  }

  return errors;
};

const redForm = reduxForm({
  form: 'tasks',
  validate,
})(TasksForm);

const mapStateToProps = (state) => ({
  jobType: selector(state, 'jobType'),
});

export default connect(mapStateToProps)(redForm);
