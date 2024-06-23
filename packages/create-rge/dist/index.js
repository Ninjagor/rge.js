#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const program = new commander_1.Command();
const TITLE_TEXT = `
  ____ ____  _____    _  _____ _____           ____   ____ _____ 
 / ___|  _ \\| ____|  / \\|_   _| ____|         |  _ \\ / ___| ____|
| |   | |_) |  _|   / _ \\ | | |  _|    _____  | |_) | |  _|  _|  
| |___|  _ <| |___ / ___ \\| | | |___  |_____| |  _ <| |_| | |___ 
 \\____|_| \\_\\_____/_/   \\_\\_| |_____|         |_| \\_\\\\____|_____|  
`;
const poimandresTheme = {
    blue: "#add7ff",
    cyan: "#89ddff",
    green: "#5de4c7",
    magenta: "#fae4fc",
    red: "#d0679d",
    yellow: "#fffac2",
};
program
    .version('0.0.1')
    .description('Create a new RGE.js project');
const createMultifileProject = (projectName) => {
    const name = projectName;
    if (!name) {
        console.error('Error: Please provide a project name.');
        process.exit(1);
    }
    const rgeGradient = (0, gradient_string_1.default)(Object.values(poimandresTheme));
    console.log(rgeGradient.multiline(TITLE_TEXT));
    console.log(`Creating Project: ${name}... \n`);
    try {
        const projectPath = path_1.default.join(process.cwd(), name);
        fs_1.default.mkdirSync(projectPath);
        process.chdir(projectPath);
        fs_1.default.mkdirSync('public');
        fs_1.default.mkdirSync('scripts');
        const publicDir = path_1.default.join(projectPath, 'public');
        const indexHtmlPath = path_1.default.join(publicDir, 'index.html');
        fs_1.default.writeFileSync(indexHtmlPath, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        body, html, * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            gap: 10px;
        }
        canvas {
            border: 1px solid black;
        }
        section {
            width: 60%;
            height: 100%;
            position: relative;
        }
        #canvasSection {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40%;
            flex-direction: column;
            gap: 20px;
        }
        div {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="popupContainer">
        <canvas id="gameCanvas">
        </canvas>
    </div>



    <script type="module">
        import * as rgejs from "https://cdn.jsdelivr.net/npm/rge.js@latest/dist/rge.min.js"
        window.rgejs = rgejs;
    </script>


    <script type="module" src="../scripts/game.js"></script>
</body>
</html>
`);
        const scriptsDir = path_1.default.join(projectPath, 'scripts');
        const gameJsPath = path_1.default.join(scriptsDir, 'game.js');
        fs_1.default.writeFileSync(gameJsPath, `
const r = rgejs;
import { rge } from "./engine.js"
`);
        const configJsPath = path_1.default.join(scriptsDir, 'configs.js');
        fs_1.default.writeFileSync(configJsPath, `
import { preload, setup, tick } from "./RuntimeFunctions/index.js"

export const engineConfigs = {
	preload: preload,
	setup: setup,
	tick: tick,
	centeredOrigin: false,
}
`);
        const storeJsPath = path_1.default.join(scriptsDir, 'store.js');
        fs_1.default.writeFileSync(storeJsPath, `
const variableStore = {
	/*
	Input all GLOBAL variables here example:
	x: 20
	*/
}

export function GetVariable(_var) {
	return variableStore[_var];
}

export function SetVariable(_var, _val) {
	variableStore[_var] = _val;
}
`);
        const engineJsPath = path_1.default.join(scriptsDir, 'engine.js');
        fs_1.default.writeFileSync(engineJsPath, `
// Import configurations for the engine;
import { engineConfigs } from "./configs.js";

// Example using the \`Engine\` class. Replace this with a \`SceneManager\` if needed (in complex projects)
export const rge = new rgejs.Engine('gameCanvas');

// Apply configs and start
rge.configure(engineConfigs);
rge.start();
`);
        const READMEPath = path_1.default.join(scriptsDir, 'README.txt');
        fs_1.default.writeFileSync(READMEPath, `
Welcome to a new rge.js project, scaffolded using \`create - rge\`!

Important notes and info:

File Structure:

- game.js (Import the engine, is the script linked to the HTML file)
- engine.js (Initializes and starts the Engine or SceneManager)
- configs.js (Customizable configuration options for the \`Engine\`)
- store.js (Global variable store with getters and setters)
- RuntimeFunctions/
	- preload/index.js (Asynchronous preload function for asset loading)
	- setup/index.js (Setup logic)
	- tick/index.js (Game tick logic. Most game logic will be referenced here)
	- index.js (modular export file)

LSP Warnings:

\`Could not find name 'rgejs'\` - Ignore this error. rgejs is a global module of the rgejs library stored created in \`index.html\` after being imported via a CDN. JS LSP's usually do not scan html files for exports, but this warning is nothing to be worried about.

Additional Info:

You can reference documentation at \`rge - docs.vercel.app\` for more information
`);
        process.chdir(scriptsDir);
        fs_1.default.mkdirSync('RuntimeFunctions');
        const RFdir = path_1.default.join(scriptsDir, 'RuntimeFunctions');
        process.chdir(RFdir);
        fs_1.default.mkdirSync('preload');
        fs_1.default.mkdirSync('setup');
        fs_1.default.mkdirSync('tick');
        const indexJsOne = path_1.default.join(RFdir, 'index.js');
        fs_1.default.writeFileSync(indexJsOne, `
export { preload } from "./preload/index.js";
export { setup } from "./setup/index.js";
export { tick } from "./tick/index.js";
`);
        const preloadDir = path_1.default.join(RFdir, 'preload');
        process.chdir(preloadDir);
        const indexJsTwo = path_1.default.join(preloadDir, 'index.js');
        fs_1.default.writeFileSync(indexJsTwo, `
export const preload = async () => {

}
`);
        const setupDir = path_1.default.join(RFdir, 'setup');
        process.chdir(setupDir);
        const indexJsThree = path_1.default.join(setupDir, 'index.js');
        fs_1.default.writeFileSync(indexJsThree, `
export function setup() {

}
`);
        const tickDir = path_1.default.join(RFdir, 'tick');
        process.chdir(tickDir);
        const indexJsFour = path_1.default.join(tickDir, 'index.js');
        fs_1.default.writeFileSync(indexJsFour, `
export function tick() {

}
`);
        console.log("Multifile Project Create Successfully!");
    }
    catch (error) {
        console.error("An error occured.");
        process.exit(1);
    }
};
const createProject = (projectName) => {
    const name = projectName;
    if (!name) {
        console.error('Error: Please provide a project name.');
        process.exit(1);
    }
    const rgeGradient = (0, gradient_string_1.default)(Object.values(poimandresTheme));
    console.log(rgeGradient.multiline(TITLE_TEXT));
    console.log(`Creating Project: ${name}... \n`);
    try {
        const projectPath = path_1.default.join(process.cwd(), name);
        fs_1.default.mkdirSync(projectPath);
        process.chdir(projectPath);
        fs_1.default.mkdirSync('public');
        fs_1.default.mkdirSync('scripts');
        const publicDir = path_1.default.join(projectPath, 'public');
        const indexHtmlPath = path_1.default.join(publicDir, 'index.html');
        fs_1.default.writeFileSync(indexHtmlPath, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        body, html, * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            gap: 10px;
        }
        canvas {
            border: 1px solid black;
        }
        section {
            width: 60%;
            height: 100%;
            position: relative;
        }
        #canvasSection {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40%;
            flex-direction: column;
            gap: 20px;
        }
        div {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="popupContainer">
        <canvas id="gameCanvas">
        </canvas>
    </div>



    <script type="module">
        import * as rgejs from "https://cdn.jsdelivr.net/npm/rge.js@latest/dist/rge.min.js"
        window.rgejs = rgejs;
    </script>


    <script type="module" src="../scripts/game.js"></script>
</body>
</html>
`);
        const scriptsDir = path_1.default.join(projectPath, 'scripts');
        const gameJsPath = path_1.default.join(scriptsDir, 'game.js');
        fs_1.default.writeFileSync(gameJsPath, `
/*

Welcome to your new RGE.js Project!
Get started writing your code here!

The default canvas ID is 'gameCanvas', and the default popup container id is 'popupContainer' 

The variable 'r' defined below is a packaged namespace of the rgejs library! You can access 'rgejs' from any JS file.

There are many ways to run your game. The easiest way is to install python and run the command 'python3 -m http.server 8080'. Open localhost:8080/public to view your game!
Happy Hacking!
*/

const r = rgejs;
`);
        console.log('Project created successfully!');
    }
    catch (error) {
        console.error("An error occured.");
        process.exit(1);
    }
};
program
    .command('create <projectName>')
    .description('Create a new RGE project')
    .action(createProject);
program
    .command('create-multifile <projectName>')
    .description('Scaffold a new multi file RGE project for complex projects')
    .action(createMultifileProject);
program.parse(process.argv);
//# sourceMappingURL=index.js.map