export class HTMLBasedPopup {
    constructor(containerId, contents, data) {
        this.contents = contents;
        this.containerId = containerId;
        const { width = "500px", height = "300px", title = "", startXOffset = 0, startYOffset = 0, customDestructor = () => {} } = data || {};
        this.width = width;
        this.height = height;
        this.title = title;
        this.startXOffset = startXOffset;
        this.startYOffset = startYOffset;
        this.customDestructor = customDestructor;

        this.createPopup();
        this.addDraggableZone();

        // const margin = document.createElement('div');
        // margin.style.marginTop = "0px";
        // this.popup.appendChild(margin)
        this.popup.appendChild(this.contents);
    }

    createPopup() {
        this.popup = document.createElement('div');
        // this.popup.style.
        this.popup.classList.add('popup');

        document.getElementById(this.containerId).appendChild(this.popup);

        this.popup.style.border = '1px solid #ccc';
        this.popup.style.backgroundColor = '#fff';
        this.popup.style.position = "absolute"
        this.popup.style.padding = '10px';
        this.popup.style.top = "50%";
        this.popup.style.left = "50%";
        this.popup.style.fontFamily = 'sans-serif';
        this.popup.style.borderTopLeftRadius = "10px"
        this.popup.style.borderTopRightRadius = "10px"
        this.popup.style.borderBottomLeftRadius = "10px"
        this.popup.style.borderBottomRightRadius = "10px"
        const xTranslate = -50 + this.startXOffset;
        const yTranslate = -50 + this.startYOffset;
        this.popup.style.transform = `translate(${xTranslate}%, ${yTranslate}%)`
        this.popup.style.height = this.height;
        this.popup.style.width = this.width;
        this.popup.style.paddingTop = "35px";
        this.popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }

    addDraggableZone() {
        const draggableZone = document.createElement('div');
        draggableZone.classList.add('draggable-zone');
        draggableZone.style.height = '25px';
        draggableZone.style.background = 'white';
        // draggableZone.style.cursor = 'move';
        draggableZone.style.position = 'absolute'
        draggableZone.style.top = "0";
        draggableZone.style.left = "0";
        draggableZone.style.background = "rgba(0, 0, 0, 0.01)"
        draggableZone.style.width = "100%";
        draggableZone.style.borderTopLeftRadius = "10px"
        draggableZone.style.borderTopRightRadius = "10px"
        draggableZone.style.borderBottom = "1px solid rgba(0, 0, 0, 0.1)"

        const title = document.createElement(
            'p'
        );
        title.textContent = this.title;
        title.style.position = 'absolute';
        title.style.left = '10px';
        title.style.top = '50%';
        title.style.fontSize = "12px";
        title.style.marginTop = "3px"
        title.style.opacity = '40%';
        title.style.fontFamily = 'sans-serif';
        title.style.height = '20px';
        title.style.borderRadius = '1000px';
        title.style.transform = 'translateY(-50%)';

        draggableZone.appendChild(title)

        const xBtn = document.createElement('button');
        xBtn.style.position = 'absolute';
        xBtn.style.right = '5px';
        xBtn.style.top = '50%';
        xBtn.style.width = '20px';
        xBtn.style.height = '20px';
        xBtn.style.borderRadius = '1000px';
        xBtn.style.transform = 'translateY(-50%)';
        xBtn.style.border = 'none';
        xBtn.style.display = 'flex';
        xBtn.style.alignItems = 'center';
        xBtn.style.background = 'rgba(0, 0, 0, 0.03)';
        xBtn.style.justifyContent = 'center';
        xBtn.innerHTML = '<p style="font-size: 13px; display: flex; align-items: center; justify-content: center; opacity: 0.6; font-family: monospace;">x</p>';
        xBtn.style.cursor = "pointer";

        xBtn.addEventListener('mouseenter', () => {
            xBtn.style.background = 'rgba(0, 0, 0, 0.1)';
        });
        
        xBtn.addEventListener('mouseleave', () => {
            xBtn.style.background = 'rgba(0, 0, 0, 0.03)';
        });
        
        xBtn.addEventListener('mousedown', () => {
            xBtn.style.background = 'rgba(0, 0, 0, 0.2)';
        });
        
        xBtn.addEventListener('mouseup', () => {
            xBtn.style.background = 'rgba(0, 0, 0, 0.1)';
        });

        xBtn.addEventListener('click', () => {
            this.removePopup();
        });

        draggableZone.appendChild(xBtn);
        this.popup.appendChild(draggableZone);

        let isDragging = false;
        let offsetX, offsetY;

        draggableZone.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - this.popup.offsetLeft;
            offsetY = event.clientY - this.popup.offsetTop;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                this.popup.style.left = (event.clientX - offsetX) + 'px';
                this.popup.style.top = (event.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    removePopup() {
        this.customDestructor();
        this.popup.parentNode.removeChild(this.popup);
        this.popup = null;
    }
}