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

## Docker

If you want to compile the code and test it out in your browser, then you can use 
```bash
docker build -t jscropandresize .
```
and
```bash
docker run -p 8088:80 jscropandresize
```
to create and run docker image, after that you can open [http://localhost:8088](http://localhost:8088) in your browser

## License

All code files (*.ts) and HTML files (*.html) are under [Unlicense](https://unlicense.org/)

The CSS file (mvp.css) is under [MIT License](https://github.com/andybrewer/mvp/blob/master/LICENSE).