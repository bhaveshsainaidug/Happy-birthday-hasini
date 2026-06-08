# Audio folder

Place your background music file here:

```
public/
  audio/
    music.mp3   ← Your file here
```

## Supported Formats
- `.mp3` (recommended)
- `.ogg`
- `.wav`

## File Name
The app expects: `music.mp3`

If you want a different name, update this line in `src/App.jsx`:
```js
const MUSIC_SRC = '/audio/music.mp3'
```

## Music Tips
- Use a soft, instrumental track (2-4 minutes, loops well)
- Suggested genres: cinematic piano, lo-fi ambient, orchestral
- The audio fades in gently after the user taps "Begin the Journey"
- Music loops automatically
