export class HTMLInput {
    constructor(x, y, data = {}) {
        const { canvasId = "", placeholder = "", style = "", id = `input-${JSON.stringify(Math.random() * (10000))}` } = data;
        this.x = x;
        this.y = y;
        this.canvasId = canvasId;
        this.placeholder = placeholder;
        this.style = style;
        this.id = id;
        this.ref = null;
        this.render();
    }

    render() {
        const parent = document.getElementById(this.canvasId).parentElement;
        const input = document.createElement('input');

        input.placeholder = this.placeholder;

        input.style.left = `${this.x}px`
        input.style.position = `absolute`
        input.style.top = `${this.y}px`

        input.id = this.id;

        const styles = this.style.split(';').filter(s => s.trim() !== '');
        styles.forEach(style => {
            const [property, value] = style.split(':').map(s => s.trim());
            if (property && value) {
                input.style[property] = value;
            }
        });
        this.ref = input;
        parent.appendChild(input);
    }

    destroy() {
        if (this.ref) {
            const parent = document.getElementById(this.canvasId).parentElement;
            parent.removeChild(this.ref);
            this.ref = null;
        }
    }
}