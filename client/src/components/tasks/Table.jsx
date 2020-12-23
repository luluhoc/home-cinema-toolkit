import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Moment from 'react-moment';
import SwitchTask from './SwitchTask';

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
  if (time.dayOfWeek) {
    return `Every ${d[time.dayOfWeek]} at ${Number(time.hour) >= 0 && Number(time.hour) < 10 ? `0${time.hour}` : time.hour}:${Number(time.minute) >= 0 && Number(time.minute) < 10 ? `0${time.minute}` : `${time.minute}`}`;
  }
  return `Today ${Number(time.hour) >= 0 && Number(time.hour) < 10 ? `0${time.hour}` : time.hour}:${Number(time.minute) >= 0 && Number(time.minute) < 10 ? `0${time.minute}` : `${time.minute}`}`;
};

export default function BasicTable({ tasks }) {
  const classes = useStyles();
  const rat = {
    rating: 'Delete By Rating',
    byAge: 'Delete By Age',
  };
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
          {tasks && tasks.map((t) => (
            <TableRow key={t.jobType}>
              <TableCell component="th" scope="row">
                {rat[t.jobType]}
              </TableCell>
              <TableCell align="right">{t.variable && t.variable.length > 5 ? <Moment format="YYYY/MM/DD">{t.variable}</Moment> : t.variable}</TableCell>
              <TableCell align="right"><Moment format="YYYY/MM/DD HH:mm">{t.lastEx}</Moment></TableCell>
              <TableCell align="right">{millisToMinutesAndSeconds(t.exTime)}</TableCell>
              <TableCell align="right">{nextEx(t.time)}</TableCell>
              <TableCell align="right">
                <SwitchTask on={t.on} jobType={t.jobType} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
