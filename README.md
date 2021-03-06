<img src="https://github.com/luluhoc/home-cinema-toolkit/blob/master/screenshots/logogit.png?raw=true" style="width: 30%;" alt="HOME CINEMA TOOLKIT"/>

# HCT - Home Cinema Toolkit [![DeepScan grade](https://deepscan.io/api/teams/12204/projects/15203/branches/300475/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=12204&pid=15203&bid=300475)
<a href="https://www.buymeacoffee.com/lulu45" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>
<img src="https://github.com/luluhoc/home-cinema-toolkit/blob/master/screenshots/ss1.png?raw=true" style="width: 100%;" alt="HOME CINEMA TOOLKIT"/>
<img src="https://github.com/luluhoc/home-cinema-toolkit/blob/master/screenshots/ss2.png?raw=true" style="width: 100%;" alt="HOME CINEMA TOOLKIT"/>

- ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `Please keep in mind that this is in early beta stage, it is growing in the future.`

It will be a toolkit with several useful tools for home server enthusiasts.



Features
-------
The script will clean up your library based on the IMDB Rating.

You can delete movies based on IMDB Rating, the program fetches IMDb ratings for movies and keeps them in the database for one month, after expiring it fetches them again.
You can also delete movies by age, and use the tasks to program deleting movies at the given time. There is a lot to do more in it.

The script fetches all the movies, you have in the database, then fetches rating from IMDB for every movie, and compares the movie rating with the rating set up by User.

I recommend running this script every month if you wish to have movies based on real IMDB rating in your collection.


To install with docker
-------
https://hub.docker.com/r/lulu45/home-cinema-toolkit
```
docker run -d \
  --name HCT \
  -p 12400:12400 \
  --restart unless-stopped \
  lulu45/home-cinema-toolkit:latest
```

If you want to use an external DB, mount it to the following path.
```
docker run -d \
  --name HCT \
  -p 12400:12400 \
  -v /path/to/db:/usr/src/app/db \
  --restart unless-stopped \
  lulu45/home-cinema-toolkit:latest
```

Docker Compose
```
HCT:
    container_name: HCT
    image: lulu45/home-cinema-toolkit:latest
    restart: unless-stopped
    network_mode: host
    ports:
      - 12400:12400
    #Optional Mount for DB
    volumes:
        - /path/to/db:/usr/src/app/db
```

Settings
-------
**Radarr URL:** The IP or domain in front of your Radarr instance.

**Radarr API:** The API key for Radarr (Settings -> General -> Security)

**API v3:** Enable if Radarr version is 3.0 or higher.

**OMDB Key:** https://www.omdbapi.com/apikey.aspx

**Add Exclusions:** Automatically add future exclusions to Radarr.

**Delete Files:** Automatically delete movies below threshold. 

**Clear Rating DB:** Flush the database. 
