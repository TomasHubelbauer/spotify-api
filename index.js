import fetch from './fetch.js';
import fs from 'fs';

void async function() {
  const { clientId, clientSecret, artistId, marketCode } = JSON.parse(await fs.promises.readFile('data.json'));

  const tokenResponse = await fetch(
    // Note that the Spotify documentation says to send this in the body... but that does not work
    'https://accounts.spotify.com/api/token?grant_type=client_credentials',
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token } = JSON.parse(tokenResponse);
  
  const artistResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=${marketCode}`,
    {
      headers: {
        Authorization: 'Bearer ' + access_token,
      }
    }
  );

  const { tracks } = JSON.parse(artistResponse);
  const ids = tracks.map(track => track.id);

  const tracksResponse = await fetch(
    `https://api.spotify.com/v1/tracks?ids=${ids}&market=${marketCode}`,
    {
      headers: {
        Authorization: 'Bearer ' + access_token,
      }
    }
  );

  await fs.promises.writeFile('result.json', JSON.stringify(JSON.parse(tracksResponse), null, 2));
}()
