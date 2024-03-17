export class HTMLButton {
    constructor(x, y, data = {}) {
        const { canvasId = "", text = "", onClick = () => {}, style = "", id = `btn-${JSON.stringify(Math.random() * (100))}` } = data;
        this.x = x;
        this.y = y;
        this.canvasId = canvasId;
        this.text = text;
        this.onClick = onClick;
        this.style = style;
        this.id = id;
        this.ref = null;
        this.render();
    }

    render() {
        const button = `<button onclick="${this.onClick}" style="position: absolute; left: ${this.x}px; top: ${this.y}px;" id="${this.id}">Hello</button>`
        const parent = document.getElementById(this.canvasId).parentElement;
        const btn = document.createElement('button');

        btn.textContent = this.text;

        btn.onclick = this.onClick;

        btn.style.left = `${this.x}px`
        btn.style.position = `absolute`
        btn.style.top = `${this.y}px`

        btn.id = this.id;

        const styles = this.style.split(';').filter(s => s.trim() !== '');
        styles.forEach(style => {
            const [property, value] = style.split(':').map(s => s.trim());
            if (property && value) {
                btn.style[property] = value;
            }
        });
        this.ref = btn;
        parent.appendChild(btn);
    }

    destroy() {
        if (this.ref) {
            const parent = document.getElementById(this.canvasId).parentElement;
            parent.removeChild(this.ref);
            this.ref = null;
        }
    }
}