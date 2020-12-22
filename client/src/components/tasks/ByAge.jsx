import React, { useEffect } from 'react';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'; // choose your lib
import {
  DatePicker, LocalizationProvider,
} from '@material-ui/pickers';
import { TextField } from '@material-ui/core';
import { renderCheckbox } from '../helpers/formHelpers';

const ByAge = ({ Field, change }) => {
  const [selectedDate, handleDateChange] = React.useState(new Date());
  useEffect(() => {
    change('variable', selectedDate);
    return () => {
      change('variable', '');
      change('deleteFiles', true);
    };
  }, [change, selectedDate]);
  return (
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
  );
};

export default ByAge;
