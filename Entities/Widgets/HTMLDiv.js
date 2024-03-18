export class HTMLDiv {
    constructor(x, y, data = {}) {
        const { canvasId = "", style = "", id = `div-${JSON.stringify(Math.random() * (10000))}` } = data;
        this.x = x;
        this.y = y;
        this.canvasId = canvasId;
        this.style = style;
        this.id = id;
        this.ref = null;
        this.render();
    }

    render() {
        const parent = document.getElementById(this.canvasId).parentElement;
        const div = document.createElement('div');

        div.style.left = `${this.x}px`
        div.style.position = `absolute`
        div.style.top = `${this.y}px`

        div.id = this.id;

        const styles = this.style.split(';').filter(s => s.trim() !== '');
        styles.forEach(style => {
            const [property, value] = style.split(':').map(s => s.trim());
            if (property && value) {
                div.style[property] = value;
            }
        });
        this.ref = div;
        parent.appendChild(div);
    }

    destroy() {
        if (this.ref) {
            const parent = document.getElementById(this.canvasId).parentElement;
            parent.removeChild(this.ref);
            this.ref = null;
        }
    }
}