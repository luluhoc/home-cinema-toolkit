import React from 'react';
import { Switch } from '@material-ui/core';
import { connect } from 'react-redux';
import { switchTask } from '../../actions/tasks.actions';

const SwitchTask = ({ on, switchTask, jobType }) => {
  const handleChange = () => {
    switchTask({
      on,
      jobType,
    });
  };
  return (
    <Switch
      name="checkedA"
      checked={on}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'secondary checkbox' }}
    />
  );
};

export default connect(null, { switchTask })(SwitchTask);
