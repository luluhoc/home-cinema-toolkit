<img src="https://github.com/luluhoc/home-cinema-toolkit/blob/master/client/src/components/layout/logo.png?raw=true" style="width: 50%;" alt="HOME CINEMA TOOLKIT"/>

# HCT - Home Cinema Toolkit
<a href="https://www.buymeacoffee.com/lulu45" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>
<img src="https://github.com/luluhoc/home-cinema-toolkit/blob/master/screenshots/ss.png?raw=true" style="width: 100%;" alt="HOME CINEMA TOOLKIT"/>

- ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `Please keep in mind that this is in early beta stage.`

 It is an early beta of a project that will be growing in the future.

It will be a toolkit with several useful tools for home server enthusiasts.

For now, you can get movies from radarr and delete them according to the IMDB ratings.

To install with docker
-------
https://hub.docker.com/r/lulu45/home-cinema-toolkit
```
docker run -d \
  --name HCT \
  -p 12400:12400 \
  -v /path/to/db:/usr/src/app/db \
  --restart unless-stopped \
  lulu45/home-cinema-toolkit:latest
```
*The Script will clean up your library based on the IMDB Rating.*

*The Script fetches all the movies, you have in the database, then fetches rating from IMDB for every movie, and compares *the movie rating with the rating set up by User.*

*I recommend running this script every month if you wish to have movies based on real IMDB rating in your collection.*
