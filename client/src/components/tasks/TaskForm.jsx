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
import {
  Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, Select,
} from '@material-ui/core';

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

const renderSelect = ({
  input, label, meta, id, className, fullWidth,
}) => {
  if (meta.error && meta.touched) {
    return (
      <>
        <FormControl fullWidth error variant="outlined" className={className} required>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select native {...input} id={id} label={label}>
            <option value="rating">Rating</option>
            <option value="byAge">Delete By Age</option>
          </Select>
          <FormHelperText id="my-helper-text">{meta.error}</FormHelperText>
        </FormControl>
      </>
    );
  }
  return (
    <>
      <FormControl fullWidth variant="outlined" className={className} required>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select native {...input} id={id} label={label}>
          <option value="rating">Rating</option>
          <option value="byAge">Delete By Age</option>
        </Select>
      </FormControl>
    </>
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

const selector = formValueSelector('tasks');

const TasksForm = ({
  change, handleSubmit, onSubmit, initialize, jobType,
}) => {
  const [selectedDate, handleDateChange] = React.useState(new Date());
  const classes = useStyles();
  useEffect(() => {
    initialize({
      jobType: 'rating',
      addExclusion: true,
      deleteFiles: true,
    });
  }, []);
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field name="time[hour]" id="hour" type="number" label="Hour" placeholder="https://radarr.domain.com" autoFocus component={renderField} />
          <Field name="time[minute]" id="minute" type="number" label="Minute" placeholder="https://radarr.domain.com" autoFocus component={renderField} />
          <Field name="time[day]" id="day" type="number" label="Day" autoFocus component={renderField} />
          <Field name="jobType" id="jobType" label="Job Type" autoFocus component={renderSelect} />
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
                  renderInput={(props) => <TextField label fullWidth {...props} />}
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
