This is a starter template for [Learn Next.js](https://nextjs.org/learn).

This is a project for learning, attempt is to create a light version of Spotify

# Music Copyright

ACTION by Alex-Productions | https://onsound.eu/
Music promoted by https://www.free-stock-music.com
Creative Commons / Attribution 3.0 Unported License (CC BY 3.0)
https://creativecommons.org/licenses/by/3.0/deed.en_US

Tension by Alex-Productions | https://onsound.eu/
Music promoted by https://www.free-stock-music.com
Creative Commons / Attribution 3.0 Unported License (CC BY 3.0)
https://creativecommons.org/licenses/by/3.0/deed.en_US

Underwater City by Alex-Productions | https://onsound.eu/
Music promoted by https://www.free-stock-music.com
Creative Commons / Attribution 3.0 Unported License (CC BY 3.0)
https://creativecommons.org/licenses/by/3.0/deed.en_US

# Spotify web player

https://developer.spotify.com/documentation/web-playback-sdk/howtos/web-app-player

https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track

# Picture copyright

MS Copilot was used to generate the pictures

# Icons

https://fonts.google.com/icons

# progress bar inspiration

https://blog.logrocket.com/creating-custom-css-range-slider-javascript-upgrades/

# Spotify's play functionality

- if a context is passed in along with a track, then the context will continue after the requested song has been played
- if only a song is passed in, the playback queue is emptied and the song is the only track that will play

# roadmap

- search results / artist view to display show more -button
- remove right sidebar, bring it back when there's content to show there
- move polling to poll the SDK instead of API
- use Vercel to host the app
- add a domain
- login button
- scroll bar in main content
- show playlists in left bar
- mobile enhancements
  - hide left bar on mobile
  - rework bottom bar on mobile
- routing support

# todo

- move to mobile-first / responsive system
- bottom bar could (should?) be a float instead of part of the grid
- at least search (likely track list too) is re-rendering on every data fetch. Dis is bad.
- move API calls to be executed on server-side, update cookie settings
  - need a bit more research on this, on one hand it's not good to route the requests
    through own server. Good to just fetch from the browser.
  - https://www.npmjs.com/package/iron-session/v/8.0.0-beta.5
  - iron-session could be used to store the session of the user, and the access_token would not be exposed to client
- add top part for the tracks list view (image, name etc)
- when requests are sent to change volume, track or seek, we should immediately refetch data. This will reduce the problem of laggy UI we have now.
- could we control seek, volume change, song change and monitor those values through the Spotify JS bundle? would that make changes visible quicker?
- i18n support
