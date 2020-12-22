import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'; // choose your lib
import {
  DatePicker, LocalizationProvider,
} from '@material-ui/pickers';
import { renderCheckbox } from '../helpers/formHelpers';

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
  const [selectedDate, handleDateChange] = React.useState(new Date());
  useEffect(() => {
    initialize({ addExclusion: true, date: selectedDate });
  }, [initialize, selectedDate]);
  const formSub = (formValues) => {
    change('date', selectedDate);
    onSubmit(formValues);
  };
  return (
    <>
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(formSub)} noValidate>
          <LocalizationProvider dateAdapter={DateFnsAdapter}>
            <DatePicker
              label="Before"
              renderInput={(props) => <TextField label fullWidth {...props} />}
              value={selectedDate}
              onChange={(date) => { handleDateChange(date); }}
            />
          </LocalizationProvider>
          <Field name="addExclusion" defaultValue="true" id="addExclusion" label="Add Exclusions" autoFocus component={renderCheckbox} />
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
