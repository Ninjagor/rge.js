declare module "rge.js" {
    type KeyPressAction = {
        press?: () => void;
        release?: () => void;
    };
    
    type MouseClickHandler = (entity: Entity) => void;
    
    // type Entity = {
    //     render: (context: CanvasRenderingContext2D) => void;
    //     destroy: () => void;
    // };

    type SetBackgroundType = {
        image: string | null;
        color: string | null;
        repeat: string | null;
    }

    type ButtonDataType = {
        EngineRef: Engine,
        buttonColor?: string,
        borderRadius?: number,
        borderWidth?: number,
        borderColor?: string,
        text: string,
        textSize?: string,
        textColor?: string,
        font?: String,
        onClick?: () => void;
    }

    type PBRectDataType = {
        EngineRef: Engine,
        width: number,
        height: number,
        rotation?: number,
        fillColor?: number,
        onClick?: () => void; 
    }

    type HTMLBasedPopupDataType = {
        width: string;
        height: string;
        title: string;
        startXOffset: number;
        startYOffset: number;
        customDestructor: () => any;
    }

    type EngineDataParams = {
        isEmbedded: boolean;
    }

    export namespace Widgets {
        export class Button extends Entity {

            x: number;
            y: number;
            data: ButtonDataType;
            text: string;
            textSize: number;
            textColor: string;
            font: string;
            fillColor: string;
            br: number;
            bw: number;
            bc: string;
            onClick: () => void;
            groupWrapper: null | Group;
            textRef: null | Text;
    
            createEntities: () => void;
    
            constructor(x: number, y: number, data: ButtonDataType);
        }
    
        export class UIRect extends Rect {
            // same ppties basically, more updating TODO
        }

        export class HTMLBasedPopup {
            constructor(containerId: string, contents: HTMLElement, data: HTMLBasedPopupDataType)

            removePopup: () => void;
        }
    }

    export class Scene {
        constructor(canvasId: string, fps: number);

        engine: Engine;

        configuration(config: {
            preload?: () => void;
            setup?: () => void;
            tick?: () => void;
            centeredOrigin?: boolean;
        });

        start: () => void;

        stop: () => void;
    }

    export class SceneManager{
        constructor();
        scenes: {
            [key: string]: [Scene, {
                preload?: () => void;
                setup?: () => void;
                tick?: () => void;
                centeredOrigin?: boolean;
            }]
        };
        currentScene: null | Scene;
        currentEngine: null | Engine;
        addScene: (sceneName: string, scene: Scene, config: {
            preload?: () => void;
            setup?: () => void;
            tick?: () => void;
            centeredOrigin?: boolean;
        }) => void;

        setScene: (sceneName: string) => void;

        startScene: () => void;
    }

    export namespace PolyBased {
        export class PBRect extends Polygon {
        x: number;
        y: number;
        EngineRef: Engine;
        width: number;
        height: number;
        rotation: number;
        fillColor: number;
        polyrectRef: null | Polygon;
        constructor(x: number, y: number, data: PBRectDataType)

        // @ts-expect-error
        update: (x: number, y: number, data: PBRectDataType) => void;
        }
    }


    
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
        backgroundColor: string | null;
        backgroundImage: string | null;
        backgroundRepeat: string | null;

        debugEntity: (entity: Entity, offsetY?: number) => void;
        // Under debugging currently
        // backgroundSize: string | null;
        addKeyPressAction: (actions: { [key: string]: KeyPressAction }) => void;
        addMouseClickHandler: (handler: MouseClickHandler) => void;
        handleMouseClick: (event: MouseEvent) => void;
        mouseClickHandlers: MouseClickHandler[];
        keyStates: any; 
        findDistance: (...args: any[]) => any;
        mouseX: number;
        mouseY: number;
        isMouseDown: boolean;
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

        configure: (configs: {
            preload?: () => void;
            setup?: () => void;
            tick?: () => void;
            centeredOrigin?: boolean;
        }) => void;

        loadImage: (image: string) => null | HTMLImageElement;

        setPreload: (
            setup: () => any
        ) => void;

        setupFunction: (
            setup: () => any
        ) => void;

        watch: (callback: () => any, dependencyArray: [() => Entity])=> void;
    
        constructor(canvasId: string, targetFps?: number, data: EngineDataParams);
    
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
        customZSort(): void;
        enableDevMode(): void;
        setBackground(options: {
            image: string | null;
            color: string | null;
            repeat: string | null;
        }): void;
    }

    export class Group extends Entity {
        x: number;
        y: number;
        entities: Entity[];

        constructor(x: number, y: number);

        addEntity: (entity: Entity) => void;

        removeEntity: (index: number) => void;
    }

    export class Entity {
        x: number;
        y: number;
        isDestroyed: boolean;
        zIndex: number;
        onClick: (() => void) | null;
        class: [];
    
        constructor(x: number, y: number);
    
        update(): void;
    
        render(context: CanvasRenderingContext2D): void;
    
        destroy(): void;
    
        onClickHandler(): void;

        addClass(className: string): void;

        removeClass(index: number): void;
    }

    export class Polygon extends Entity {
        constructor(x: number, y: number, vertices: any[], fillColor?: string);
    
        // @ts-expect-error
        update(x: number, y: number, vertices?: any[], fillColor?: string): void;
    
        getBoundingBox(): { x: number; y: number; width: number; height: number };
    
        setTexture(texture: HTMLImageElement, fillMode?: "cover" | "stretched"): void;
    
        render(context: CanvasRenderingContext2D): void;
    
        renderStretched(context: CanvasRenderingContext2D): void;
    
        renderCover(context: CanvasRenderingContext2D): void;
    
        hitTest(pointX: number, pointY: number): boolean;
    }

    export class Rect extends Entity {
        constructor(x: number, y: number, width: number, height: number, fillColor?: string, centered?: boolean);

        enableCentered(): void;
        disableCentered(): void;

        // @ts-expect-error
        update(x: number, y: number, fillColor?: string): void;

        setTexture(texture: HTMLImageElement, fillMode?: "cover" | "stretched"): void;

        render(context: CanvasRenderingContext2D): void;

        renderStretched(context: CanvasRenderingContext2D): void;

        renderCover(context: CanvasRenderingContext2D): void;

        hitTest(pointX: number, pointY: number): boolean;
    }

    export class Text extends Entity {
        constructor(x: number, y: number, text: string, fontSize?: number, fillStyle?: string);

        // @ts-expect-error
        update(x: number, y: number, text?: string, fontSize?: number, font?: string): void;

        getWidth(context: CanvasRenderingContext2D): number;

        render(context: CanvasRenderingContext2D): void;
    }

    export class Ellipse extends Entity {
        radius: number;
        fillColor: string;

        constructor(x: number, y: number, radius: number, fillColor?: string);

        // @ts-expect-error
        update(x: number, y: number, radius?: number, fillColor?: string): void;

        setTexture(texture: HTMLImageElement, fillMode?: "cover" | "stretched"): void;

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
