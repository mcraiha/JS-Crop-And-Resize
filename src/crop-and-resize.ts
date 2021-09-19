// These will be overridden during CI/CD
const typescriptVersion: string = "{0}";
const gitShortHash: string = "{1}";
const buildDate: string = "{2}";

interface AppState
{
    inputImg?: HTMLImageElement;
    inputWidth: number;
    inputHeight: number;

    cropTop: number;
    cropBot: number;
    cropLeft: number;
    cropRight: number;

    wantedWidth: number;
    wantedHeight: number;
}

let state: AppState = {  inputWidth: 0, inputHeight: 0, cropTop: 0, cropBot:0, cropLeft:0, cropRight:0, wantedWidth: 0, wantedHeight: 0 };

let inputCanvasContext: CanvasRenderingContext2D;

const inputCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('inputCanvas')!;
if (inputCanvas) 
{
    inputCanvasContext = inputCanvas.getContext("2d")!;
    inputCanvasContext.font = "30px Arial";
    inputCanvasContext.fillText("Select image", 10, 50);
}

let outputCanvasContext: CanvasRenderingContext2D;

const outputCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('outputCanvas')!;
if (outputCanvas)
{
    outputCanvasContext = outputCanvas.getContext("2d")!;
}

const wantedWidthInput = document.getElementById('wantedWidth');
if (wantedWidthInput)
{
    const wantedWidthActualInput: HTMLInputElement = <HTMLInputElement>wantedWidthInput;
    wantedWidthActualInput.addEventListener('input', wantedWidthUpdated);
}

const wantedHeightInput = document.getElementById('wantedHeight');
if (wantedHeightInput)
{
    const wantedHeightActualInput: HTMLInputElement = <HTMLInputElement>wantedHeightInput;
    wantedHeightActualInput.addEventListener('input', wantedHeightUpdated);
}

const inputResolutionElement: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('inputResolution')!;

const afterCropSizeElement: HTMLInputElement = <HTMLInputElement>document.getElementById('afterCropSize')!;

const fileInput = document.getElementById('imgInput');
if (fileInput)
{
    const fileActualInput: HTMLInputElement  = <HTMLInputElement>fileInput;
    if (fileActualInput)
    {
        fileActualInput.onchange = () =>
        {
            const selectedFile = fileActualInput.files![0];
            const img = new Image();
            img.onload = () => 
            {
                state = { inputImg: img, inputWidth: img.width, inputHeight: img.height, cropTop: 0, cropBot:0, cropLeft:0, cropRight:0, wantedWidth: img.width, wantedHeight: img.height };
                
                inputCanvas.width = img.width;
                inputCanvas.height = img.height;
                (<HTMLInputElement>wantedWidthInput).value = img.width.toString(10);
                (<HTMLInputElement>wantedHeightInput).value = img.height.toString(10); 
                inputResolutionElement.innerText = `Input image resolution ${img.width} x ${img.height}`;
                RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
                enableInputs();
            }

            const reader: FileReader = new FileReader();

            reader.readAsDataURL(selectedFile);
            reader.onload = (evt) =>
            {
                if( evt.target!.readyState == FileReader.DONE) 
                {
                    if (evt.target && evt.target.result)
                    {
                        img.src = evt.target.result! as string;
                    }
                }
            }
        }
    }
}

const topCropInput = document.getElementById('topCrop');
if (topCropInput)
{
    const topCropActualInput: HTMLInputElement = <HTMLInputElement>topCropInput;
    topCropActualInput.addEventListener('input', topCropUpdated);
}

const botCropInput = document.getElementById('botCrop');
if (botCropInput)
{
    const botCropActualInput: HTMLInputElement = <HTMLInputElement>botCropInput;
    botCropActualInput.addEventListener('input', botCropUpdated);
}

const leftCropInput = document.getElementById('leftCrop');
if (leftCropInput)
{
    const leftCropActualInput: HTMLInputElement = <HTMLInputElement>leftCropInput;
    leftCropActualInput.addEventListener('input', leftCropUpdated);
}

const rightCropInput = document.getElementById('rightCrop');
if (rightCropInput)
{
    const rightCropActualInput: HTMLInputElement = <HTMLInputElement>rightCropInput;
    rightCropActualInput.addEventListener('input', rightCropUpdated);
}

const crop2xButton = document.getElementById('2xCropSize');
if (crop2xButton)
{
    const crop2xButtonActualInput: HTMLInputElement = <HTMLInputElement>crop2xButton;
    crop2xButtonActualInput.addEventListener('click', () => calculateNewWantedSizes(2));
}

const crop1xButton = document.getElementById('1xCropSize');
if (crop1xButton)
{
    const crop1xButtonActualInput: HTMLInputElement = <HTMLInputElement>crop1xButton;
    crop1xButtonActualInput.addEventListener('click', () => calculateNewWantedSizes(1));
}

const crop05xButton = document.getElementById('05xCropSize');
if (crop05xButton)
{
    const crop05xButtonActualInput: HTMLInputElement = <HTMLInputElement>crop05xButton;
    crop05xButtonActualInput.addEventListener('click', () => calculateNewWantedSizes(0.5));
}

const crop025xButton = document.getElementById('025xCropSize');
if (crop025xButton)
{
    const crop025xButtonActualInput: HTMLInputElement = <HTMLInputElement>crop025xButton;
    crop025xButtonActualInput.addEventListener('click', () => calculateNewWantedSizes(0.25));
}

const savePngButton = document.getElementById('savePng');
if (savePngButton)
{
    const savePngButtonActualInput: HTMLInputElement = <HTMLInputElement>savePngButton;
    savePngButtonActualInput.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'download.png';
        link.href = outputCanvas.toDataURL();
        link.click();
      });
}

const saveJpgButton = document.getElementById('saveJpg');
if (saveJpgButton)
{
    const savePngButtonActualInput: HTMLInputElement = <HTMLInputElement>saveJpgButton;
    savePngButtonActualInput.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'download.jpg';
        link.href = outputCanvas.toDataURL('image/jpeg', 0.9);
        link.click();
      });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

fillBuildInfo('buildInfo', buildDate, gitShortHash);

export function wantedWidthUpdated(event: Event): void {
    const element = event.target as HTMLInputElement
    state.wantedWidth = Number.parseInt(element.value, 10);
    RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
}

export function wantedHeightUpdated(event: Event): void {
    const element = event.target as HTMLInputElement
    state.wantedHeight = Number.parseInt(element.value, 10);
    RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
}

export function topCropUpdated(event: Event): void {
    const element = event.target as HTMLInputElement
    state.cropTop = Number.parseInt(element.value, 10);
    RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
}

export function botCropUpdated(event: Event): void {
    const element = event.target as HTMLInputElement
    state.cropBot = Number.parseInt(element.value, 10);
    RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
}

export function leftCropUpdated(event: Event): void {
    const element = event.target as HTMLInputElement
    state.cropLeft = Number.parseInt(element.value, 10);
    RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
}

export function rightCropUpdated(event: Event): void {
    const element = event.target as HTMLInputElement
    state.cropRight = Number.parseInt(element.value, 10);
    RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
}

export function calculateNewWantedSizes(scale: number)
{
    state.wantedWidth = Math.round(scale * (state.inputWidth - state.cropLeft - state.cropRight));
    state.wantedHeight = Math.round(scale * (state.inputHeight - state.cropTop - state.cropBot));

    (<HTMLInputElement>wantedWidthInput).value = state.wantedWidth.toString(10);
    (<HTMLInputElement>wantedHeightInput).value = state.wantedHeight.toString(10);;

    RenderFromAppState(state, inputCanvasContext, outputCanvasContext, outputCanvas, afterCropSizeElement);
}

export function enableInputs()
{
    (<HTMLInputElement>wantedWidthInput).disabled = false;
    (<HTMLInputElement>wantedHeightInput).disabled = false;

    (<HTMLInputElement>topCropInput).disabled = false;
    (<HTMLInputElement>botCropInput).disabled = false;
    (<HTMLInputElement>leftCropInput).disabled = false;
    (<HTMLInputElement>rightCropInput).disabled = false;

    (<HTMLInputElement>crop2xButton).disabled = false;
    (<HTMLInputElement>crop1xButton).disabled = false;
    (<HTMLInputElement>crop05xButton).disabled = false;
    (<HTMLInputElement>crop025xButton).disabled = false;

    (<HTMLInputElement>savePngButton).disabled = false;
    (<HTMLInputElement>saveJpgButton).disabled = false;
}

export function RenderFromAppState(appState: AppState, inputCanvasContext: CanvasRenderingContext2D, outputCanvasContext: CanvasRenderingContext2D, outputCanvas: HTMLCanvasElement, afterCropSizeElement: HTMLInputElement)
{
    // Input shows crops
    inputCanvasContext.drawImage(appState.inputImg!, 0, 0);
    inputCanvasContext.fillStyle = "#999999";
    inputCanvasContext.globalAlpha = 0.65;

    // Top crop
    inputCanvasContext.fillRect(0, 0, appState.inputWidth, appState.cropTop);

    // Bottom crop
    inputCanvasContext.fillRect(0, appState.inputHeight - appState.cropBot, appState.inputWidth, appState.cropBot);

    // Left crop
    inputCanvasContext.fillRect(0, appState.cropTop, appState.cropLeft, appState.inputHeight - appState.cropTop - appState.cropBot);

    // Right crop
    inputCanvasContext.fillRect(appState.inputWidth - appState.cropRight, appState.cropTop, appState.cropRight, appState.inputHeight - appState.cropTop - appState.cropBot);

    inputCanvasContext.globalAlpha = 1.0;

    afterCropSizeElement.value = `${appState.inputWidth - appState.cropRight - appState.cropLeft} x ${appState.inputHeight - appState.cropTop - appState.cropBot}`;

    // Output shows final
    const visibleWidth: number = appState.inputWidth - appState.cropLeft - appState.cropRight;
    const visibleHeight: number = appState.inputHeight - appState.cropTop - appState.cropBot;
    outputCanvas.width = appState.wantedWidth;
    outputCanvas.height = appState.wantedHeight;
    outputCanvasContext.drawImage(appState.inputImg!, appState.cropLeft, appState.cropTop, visibleWidth, visibleHeight, 0, 0, appState.wantedWidth, appState.wantedHeight);
}

export function fillBuildInfo(elementName: string, day: string, shortHash: string): void 
{
    const buildInfoElement: HTMLElement = document.getElementById(elementName)!;
    buildInfoElement.innerHTML = `<time datetime="${day}">${day}</time> <a href="https://github.com/mcraiha/Tarjouspohja/commit/${shortHash}">#${shortHash}</a>`;
}