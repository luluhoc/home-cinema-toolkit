import {
  Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, Select, TextField,
} from '@material-ui/core';
import React from 'react';

export const renderCheckbox = ({
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

export const renderField = ({
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

export const renderSelect = ({
  input, label, meta, id, className, fullWidth, options,
}) => {
  if (meta.error && meta.touched) {
    return (
      <>
        <FormControl fullWidth error variant="outlined" className={className} required>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select native {...input} id={id} label={label}>
            {options}
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
          {options}
        </Select>
      </FormControl>
    </>
  );
};
