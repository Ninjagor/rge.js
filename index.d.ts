declare module "rge.js" {
    type KeyPressAction = {
        press?: () => void;
        release?: () => void;
    };
    
    type MouseClickHandler = (entity: Entity) => void;
    
    type Entity = {
        render: (context: CanvasRenderingContext2D) => void;
        destroy: () => void;
    };
    
    export class Engine {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        tickFunction: () => void;
        targetFps: number;
        targetFrameTime: number;
        lastTimestamp: number;
        deltaAccumulator: number;
        keyPressActions: { [key: string]: KeyPressAction };
        pressedKeys: { [key: string]: boolean };
        addKeyPressAction: (actions: { [key: string]: KeyPressAction }) => void;
        addMouseClickHandler: (handler: MouseClickHandler) => void;
        handleMouseClick: (event: MouseEvent) => void;
        mouseClickHandlers: MouseClickHandler[];
        keyStates: any; 
        findDistance: (...args: any[]) => any;
        mouseX: number;
        mouseY: number;
        entities: Entity[];
        initMouseTracking: (event: MouseEvent) => void;
        collideLineEllipse: (...args: any[]) => any;
        collideLineLine: (...args: any[]) => any;
        collideLineRect: (...args: any[]) => any;
        collidePointEllipse: (...args: any[]) => any;
        collidePointLine: (...args: any[]) => any;
        collidePointPoly: (...args: any[]) => any;
        collideRectRect: (rect1: Rect, rect2: Rect) => boolean;
        collideRectEllipse: (rect: Rect, ellipse: Ellipse) => boolean;
        collideEllipsePoly: (ellipse: Ellipse, poly: Polygon) => boolean;
        collideRectPoly: (rect: Rect, poly: Polygon) => boolean;
        collideEllipseEllipse: (ellipse1: Ellipse, ellipse2: Ellipse) => boolean;
        animationFrameId: number | null;
        renderingOrigin: "topleft" | "center";
    
        constructor(canvasId: string, targetFps?: number);
    
        start(): void;
        resizeCanvas(): void;
        handleResize(): void;
        stop(): void;
        returnPressedKeys(): void;
        addEntity(entity: Entity): void;
        setTickFunction(tickFunction: () => void): void;
        gameLoop(timestamp: number): void;
        clearCanvas(): void;
        destroyEntity(entity: Entity): void;
        setCenterOrigin(): void;
        resetOrigin(): void;
        renderEntities(): void;
    }

    export class Entity {
        x: number;
        y: number;
        isDestroyed: boolean;
        onClick: (() => void) | null;
    
        constructor(x: number, y: number);
    
        update(): void;
    
        render(context: CanvasRenderingContext2D): void;
    
        destroy(): void;
    
        onClickHandler(): void;
    }
    export class Polygon extends Entity {
        constructor(x: number, y: number, vertices: any[], fillColor?: string);
    
        update(x: number, y: number, vertices?: any[], fillColor?: string): void;
    
        getBoundingBox(): { x: number; y: number; width: number; height: number };
    
        setTexture(textureUrl: string, fillMode?: string): void;
    
        render(context: CanvasRenderingContext2D): void;
    
        renderStretched(context: CanvasRenderingContext2D): void;
    
        renderCover(context: CanvasRenderingContext2D): void;
    
        hitTest(pointX: number, pointY: number): boolean;
    }

    export class Rect extends Entity {
        constructor(x: number, y: number, width: number, height: number, fillColor?: string, centered?: boolean);

        enableCentered(): void;
        disableCentered(): void;

        update(x: number, y: number, fillColor?: string): void;

        setTexture(textureUrl: string, fillMode?: string): void;

        render(context: CanvasRenderingContext2D): void;

        renderStretched(context: CanvasRenderingContext2D): void;

        renderCover(context: CanvasRenderingContext2D): void;

        hitTest(pointX: number, pointY: number): boolean;
    }

    export class Text extends Entity {
        constructor(x: number, y: number, text: string, fontSize?: number, fillStyle?: string);

        update(x: number, y: number, text?: string, fontSize?: number, font?: string): void;

        getWidth(context: CanvasRenderingContext2D): number;

        render(context: CanvasRenderingContext2D): void;
    }

    export class Ellipse extends Entity {
        radius: number;
        fillColor: string;

        constructor(x: number, y: number, radius: number, fillColor?: string);

        update(x: number, y: number, radius?: number, fillColor?: string): void;

        setTexture(textureUrl: string, fillMode?: string): void;

        render(context: CanvasRenderingContext2D): void;

        renderStretched(context: CanvasRenderingContext2D): void;

        renderCover(context: CanvasRenderingContext2D): void;

        hitTest(pointX: number, pointY: number): boolean;
    }

    export class Sound {
        constructor(pathToAudio: string, isLooped: boolean)

        playSound: () => void;
        stopSound: () => void;
        pauseSound: () => void;
    }
}