import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import Moment from 'react-moment';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
function millisToMinutesAndSeconds(m) {
  const minutes = Math.floor(m / 60000);
  const seconds = ((m % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const nextEx = (time) => {
  const d = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Sunday',
  };
  if (time?.dayOfWeek) {
    return `Every ${d[time.dayOfWeek]} at ${Number(time.hour) > 0 && Number(time.hour) < 10 ? `0${time.hour}` : time.hour}:${time.minute}`;
  }
  return `Today ${Number(time.hour) > 0 && Number(time.hour) < 10 ? `0${time.hour}` : time.hour}:
  ${Number(time.minute) > 0 && Number(time.minute) < 10 ? `0${time.minute}` : `${time.minute}`}`;
};

export default function BasicTable({ tasks }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Variable</TableCell>
            <TableCell align="right">Last Execution</TableCell>
            <TableCell align="right">Last Duration</TableCell>
            <TableCell align="right">Execution Time</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.jobType}>
              <TableCell component="th" scope="row">
                {t.jobType}
              </TableCell>
              <TableCell align="right">{t.variable}</TableCell>
              <TableCell align="right" />
              <TableCell align="right">{millisToMinutesAndSeconds(t.exTime)}</TableCell>
              <TableCell align="right">{nextEx(t.time)}</TableCell>
              <TableCell align="right">
                <IconButton color="secondary" aria-label="add an alarm">
                  <RefreshIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
