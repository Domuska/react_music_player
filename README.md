This is a starter template for [Learn Next.js](https://nextjs.org/learn).

This is a project for learning, attempt is to create a light version of Spotify

The application is deployed at https://react-music-player-lovat-three.vercel.app/player

It does not work if the user is not added to the Spotify's portal, contact maintainer to ask for this if you are interested!

# Preview

# Spotify web player

https://developer.spotify.com/documentation/web-playback-sdk/howtos/web-app-player

https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track

# Icons

https://fonts.google.com/icons

# progress bar inspiration

https://blog.logrocket.com/creating-custom-css-range-slider-javascript-upgrades/

# roadmap

- add a domain
- mobile playback screen & seek bar
- show playlists in left bar

- side scroll bar in main content
  - possibly could implement custom scrollbar?
    - https://stackoverflow.com/questions/58563185/header-extends-over-scrollbar-when-width-100
- use <Link> elements rather than pushing user with router
  - should be easy to try out with <CurrentPlaybackInfo>
- move polling to poll the SDK instead of API
  - is this really necessary? Does it help with something?
  - if we do this, we can't show playback going on on other devices, player only shows local

# Notes

## todo

- vercel build is complaining about this:
  - The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/basic-features/eslint#migrating-existing-config
- the search functionality in top bar and in the search page are very separate, they should be combined with better component composition. Now the search works because the query param is kept in sync.
- search page should look better if there is no search results yet
- the search bar & query param should be kept in sync
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

## Screen size

- < 900px wide
  - bottom bar opens up if you click on it
  - "more" button in albums / artists disappears and becomes a carousel?
- < 1200px wide
  - main content is the only thing visible
  - library, search is pushed to bottom action bar

## Spotify's play functionality

- if a context is passed in along with a track, then the context will continue after the requested song has been played
- if only a song is passed in, the playback queue is emptied and the song is the only track that will play
