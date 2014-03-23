# gifasaurus

Small app for converting `mov` files to `gif`s.

## Dependencies

Requires `node`, `ffmpeg`, `gifsicle`, and `imagemagick`. All of which can be installed through homebrew.

```
$ brew install ffmpeg
$ brew install imagemagick
$ brew install gifsicle
```

A `package.json` file is included to easily install node dependencies however this package is not on npm.

Install node dependencies with `npm install`. To start the server `node boot`, the default will start on port 8000.

