import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const Copyright = () => (
  <>
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/luluhoc" target="_blank" component="a">
        luluhoc
      </Link>
      {' '}
      {new Date().getFullYear()}
      .
    </Typography>
    <Typography variant="body2" color="textSecondary" align="center">v.1.0.2</Typography>
  </>
);

export default Copyright;
