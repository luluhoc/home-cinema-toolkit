import React from 'react';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'; // choose your lib
import {
  DatePicker, LocalizationProvider,
} from '@material-ui/pickers';

const ByAge = () => (
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
