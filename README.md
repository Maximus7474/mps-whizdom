<p align="center">
  <img src="https://github.com/Maximus7474/mps-whizdom/blob/main/designs/TextBanner.png?raw=true">
</p>

<hr />

<p align="center">
  A Wordle © like application for lb-phone.
</p>
<p align="center">
  <img src="https://img.shields.io/github/downloads/Maximus7474/mps-whizdom/total?logo=github">
  <img src="https://img.shields.io/github/v/release/Maximus7474/mps-whizdom?logo=github">
</p>
  

## WhizDom Screenshots

<details>
  <summary>lb-phone</summary>
  <img src="ui/public/screenshots/phone/phone-1.webp" alt="WhizDom Screenshot 1: Homepage" height="450">
  <img src="ui/public/screenshots/phone/phone-2.webp" alt="WhizDom Screenshot 2: Game Screen" height="450">
</details>

<details>
  <summary>lb-tablet</summary>
  <img src="ui/public/screenshots/tablet/tablet-1.webp" alt="WhizDom Screenshot 1: Homepage" width="450">
  <img src="ui/public/screenshots/tablet/tablet-2.webp" alt="WhizDom Screenshot 2: Game Screen" width="450">
</details>

## Installing modules

1. Install [bun](https://bun.com/docs/installation)
2. CD to the `ui` folder and run `bun install`, wait for it to complete.

## Developing the app

1. Run `bun dev`
2. Go to `http://localhost:3000` in your browser to see the app in your browser.
3. Refresh and ensure the resource

## Building the app

1. Run `bun build` to build the app. The build will be in the `dist` folder.
2. Change the `ui_page` in the fxmanifest.lua to `"ui/dist/index.html"` (uncomment line 18 & comment out line 19)
3. Refresh and ensure the resource

## Credits
* Random word list: https://random-words-api.kushcreates.com
