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
program.parse(process.argv);
//# sourceMappingURL=index.js.map