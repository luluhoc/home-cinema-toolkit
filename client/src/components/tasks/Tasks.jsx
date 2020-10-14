import { Box, Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Copyright from '../layout/Copyright';
import Table from './Table';
import TaskForm from './TaskForm';

import { getTasks, setTask } from '../../actions/tasks.actions';

const Tasks = ({
  getTasks, tasks, isLoading, setTask,
}) => {
  useEffect(() => {
    getTasks();
  }, [getTasks]);
  const onSubmit = (formValues) => {
    setTask(formValues);
  };
  return (
    <Container maxWidth="lg" style={{ marginTop: 5 }}>
      <TaskForm onSubmit={onSubmit} />
      {!isLoading && <Table tasks={tasks} />}
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  tasks: state.tasks.tasks,
  isLoading: state.tasks.isLoading,
});

export default connect(mapStateToProps, {
  getTasks,
  setTask,
})(Tasks);
