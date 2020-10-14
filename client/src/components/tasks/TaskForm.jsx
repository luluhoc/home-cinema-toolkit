import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field, reduxForm, formValueSelector, formValues,
} from 'redux-form';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'; // choose your lib
import {
  DatePicker, LocalizationProvider,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { renderCheckbox, renderField, renderSelect } from '../helpers/formHelpers';

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
  const [selectedDate, handleDateChange] = React.useState(new Date());
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
  }, []);
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            name="time[hour]"
            options={hoursMinutes('hours').map((e) => <option key={e} value={e}>{e}</option>)}
            id="hour"
            className={classes.formControl}
            type="number"
            label="Hour"
            placeholder="23"
            autoFocus
            component={renderSelect}
          />
          <Field
            name="time[minute]"
            options={hoursMinutes('minutes').map((e) => <option key={e} value={e}>{e}</option>)}
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
            type="number"
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
            <>
              <LocalizationProvider dateAdapter={DateFnsAdapter}>
                <DatePicker
                  label="Before"
                  renderInput={(props) => (<TextField label fullWidth {...props} />)}
                  value={selectedDate}
                  onChange={(date) => { handleDateChange(date); change('variable', date); }}
                />
              </LocalizationProvider>
              <Field name="addExclusion" defaultValue="true" id="addExclusion" label="Add Exclusions" autoFocus component={renderCheckbox} />
            </>
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

};

const redForm = reduxForm({
  form: 'tasks',
})(TasksForm);

const mapStateToProps = (state) => ({
  jobType: selector(state, 'jobType'),
});

export default connect(mapStateToProps)(redForm);
