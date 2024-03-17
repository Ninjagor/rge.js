export class Error {
    constructor(errorHeader = "", errorDetails = "", canvasId = "", affectedFunction = "") {
        this.errorHeader = errorHeader;
        this.errorDetails = errorDetails;
        this.affectedFunction = affectedFunction;
        this.canvasId = canvasId;
        this.renderError();
    }

    renderError() {
        const parent = document.getElementById(this.canvasId).parentElement;
        const errorPopup = document.createElement('div');
        errorPopup.style.width = "`100%";
        errorPopup.style.zIndex = "`100";
        errorPopup.style.backgroundColor = "rgba(143, 4, 4, 0.9)";
        errorPopup.style.padding = "20px 10px";
        errorPopup.style.position = "absolute";
        errorPopup.style.top = "50%";
        errorPopup.style.left = "50%";
        errorPopup.style.transform = "translate(-50%, -50%)";
        errorPopup.style.display = "flex-col";
        errorPopup.style.overflowY = "auto";
        errorPopup.innerHTML = `
            <p style="font-family: sans-serif; margin: 20px 100px; color: #edb7b7; font-weight: 200; font-size: 22px;">Error</p>
            <h1 style="font-family: sans-serif; margin: 20px 100px; color: #edb7b7; font-weight: 500;">${this.errorHeader}</h1>
            <p style="font-family: monospace; margin: 20px 100px; color: #edb7b7; font-weight: 500; font-size: 20px; opacity: 60%;">${this.errorDetails}</p>
            <p style="font-family: monospace; margin: 20px 100px; color: #edb7b7; font-weight: 500; font-size: 20px; opacity: 90%;">Instigating Function: ${this.affectedFunction}</p>
        `
        parent.innerHTML = ""
        parent.appendChild(errorPopup)
    }
}