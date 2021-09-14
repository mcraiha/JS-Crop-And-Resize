# JS-Crop-And-Resize

Browser page for image crop and resize by using Javascript + HTML5 + CSS. Bundle with [Deno](https://deno.land/)

## Why

Because I needed something like this for myself

## How to bundle

Run following command to fast bundle (fast means build info is not filled)
```
deno bundle -c tsconfig.json src/crop-and-resize.ts src/crop-and-resize.js
```
or use fastbundle.sh or fastbundle.ps1

Run following commands to full bundle (full means build info is filled)
```
fullbundle.sh
```
or use fullbundle.sh or fullbundle.ps1


## License

All code files (*.ts) and HTML files (*.html) are under [Unlicense](https://unlicense.org/)

The CSS file (mvp.css) is under [MIT License](https://github.com/andybrewer/mvp/blob/master/LICENSE).