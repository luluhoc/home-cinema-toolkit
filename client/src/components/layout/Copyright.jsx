import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Grid } from '@material-ui/core';
import GitHubButton from 'react-github-button';

require('react-github-button/assets/style.css');

const Copyright = () => (
  <Grid
    container
    direction="column"
    justify="center"
    alignItems="center"
  >
    <Grid item xs={12}>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/luluhoc" target="_blank" component="a">
          luluhoc
        </Link>
        {' '}
        {new Date().getFullYear()}
        .
      </Typography>
      <a
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.buymeacoffee.com/lulu45"
      >
        <img alt="buy me a coffee" src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=lulu45&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" />
      </a>

      <Typography variant="body2" color="textSecondary" align="center">
        Buying me a coffee helps me to develop more tools, repair bugs, and warms my heart. Thanks
        <span role="img" aria-label="heart">❤️</span>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">v.1.2.1</Typography>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <GitHubButton type="stargazers" namespace="luluhoc" repo="home-cinema-toolkit" />
      </div>
    </Grid>
  </Grid>
);

export default Copyright;
