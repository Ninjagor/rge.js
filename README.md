<p align="center">
  <br/>
  <a href="https://rge-site.vercel.app/" target="_blank"><img width="135px" src="https://rge-site.vercel.app/images/RGE-banner.svg" /></a>
  <h3 align="center">RGE.js</h3>
  <p align="center">Powering your imagination and creativity with Javascript.</p>
  <p align="center">Open Source. Object Oriented. Web Driven.</p>
  <p align="center" style="align: center;">
    <a href="https://www.npmtrends.com/rge.js">
      <img src="https://img.shields.io/npm/dm/rge.js" alt="Downloads" />
    </a>
  </p>
  <p align="center">
    RGE.js is a Javascript library for simple and intuitive game development and digital art. It comes with sensible pre-built entities, utilities, and components, but is fully extensible and keeps the best practices in mind. 
  </p>
</p>
<br>

### Get Started
RGE.js is available to install on NPM as well as via CDN (`jsDelivr`). 

```
npm i rge.js@latest
```

CDN:

```html
<script type="module">
    import * as rgejs from "https://cdn.jsdelivr.net/npm/rge.js@latest/index.js"
    window.rgejs = rgejs;
</script>
```

RGE.js can be used in ANY browser environment which supports the canvas element. It works with HTML/CSS/JS and ReactJS, and likely works with other frameworks as well. 

#### Compatibility
| Framework  | Compatible? 
| :----- | :----: |
| HTML, CSS, JS    |  ✅   |
| ReactJS | ✅  |
| NextJS (CSR Components) | ✅  |
| NextJS (SSR Components) | ❌ |
| VueJS | Untested |
| Svelte/SvelteKit | Untested |
| AngularJS | Untested |

<br>

#### Warning❗️
As of right now, RGE.js is still in it's alpha phase and may have bugs/issues. 

## Documentation
RGE.js uses an Object Oriented paradigm. This means the RGE engine class and all Entities are objects and have to be handled as such. 

### Initialization with `HTML/CSS/JS`
In order to initialize RGE.js using HTML/CSS/JS, it is recommended to use the CDN install. rgejs will be added to the global `window` object, which can then be used in other `module` JS files. 

#### Important!
Import all JS files which use RGE.js as a module. For example:
```html
<script type="module" src="./script.js"></script>
```

At the top of all files, it is recommended to make a shorthand for the global `rgejs` object for simplicity.

```javascript
const r = rgejs;
```

### Starting the Engine

We will begin with the `Engine` object. This can be viewed as sort of the "Main Engine" behind RGE.js. When you first create a project, you will create a new instance of this object. Then, you will run `start()`.

```javascript
// First parameter is the id of the canvas which RGE will run on
// Second parameter is the target framerate.
const rge = new r.Engine('gameCanvas', 60);

rge.start()
```

Great! You have successfully initialized a new RGE project.

### Initialization with `ReactJS/NextJS`

Initializing RGE.js with `ReactJS` or `NextJS` is a bit different than with plain `HTML/CSS`. 

```jsx
// Add "use client" at the top of the file if using NextJS.
// "use client"
import * as r from "rge.js";
import React, { useEffect, useRef } from "react";

export default function RgeCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvasId = "gameCanvas";
        const targetFps = 60;
        
        const rge = new r.Engine(canvasId, targetFps);
        
        rge.start();

        return () => {
            rge.stop();
        };
    }, []);
    return (
        <>
            <canvas
                ref={canvasRef}
                id="gameCanvas"
                // Set your desired canvas size
                width={800}
                height={600}
            />
        </>
    )
}

```

Great! You have successfully initialized a new RGE project in React!

### Entities
`Entities` can just be viewed as different components or elements, which each have unique properties. Certain entities can be controlled, have collision, be destroyed, etc. 

An object called `Entity` exists already. Most pre-made entities are extensions of this object. Here is the basic structure of the `Entity` object:

```javascript
class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isDestroyed = false;
        this.onClick = null;
    }

    // Abstract method to be defined by subclasses
    update() { }

    // Abstract method to be defined by subclasses
    render(ctx) { }

    destroy() {
        this.isDestroyed = true;
    }

    onClickHandler() {
        if (this.onClick) {
            // onClick should be defined by subclasses
            this.onClick();
        }
    }
}
```

#### Rect
One of the most used entities is `Rect`. This simply generates a Rectangle. Let's implement one. 

```javascript
// Creating new instance of a Rect
const rect = new r.Rect(x, y, width, height, "color")
// Adding the newly made Rect
rge.addEntity(rect)
```
This code will render a `Rect` to the canvas.

`Rect` is a very robust entity, and has many use cases. However first, we will go over the game tick.

#### Game Tick
RGE.js allows programmers to implement a `tick()` function to their code. This allows them to update, or re-render certain entities. This also allows collision detection code to be added. Let's learn how to create a game tick.

```javascript
function tick() {
    // Update logic goes here.
    rect.update(newX, newY)
}

rge.setTickFunction(tick);
```
The `update()` function of rect rerenders the `Rect` at a new X and Y pos. Now, let's take a look at implementing collision by using this game tick. 


### Inputs
RGE.js supports inbuilt input detection and handling for both keyboard and mouse inputs.

#### Keyboard Inputs
RGE.js provides a natural and easy way to define keyboard input detection, and allows you to define commands for both keypresses and keyups (or key releases). Let's view some code.

```javascript
rge.addKeyPressAction({
    'q': {
        press: () => {
            console.log("Q is pressed!")
        },
        release: () => {
            console.log("Q is released!")
        }
    },
    // ... remaining input handlers
})
```
Now you'll see that whenever you press the `q` key, it logs that it is pressed, and when you release it, the console will log that Q has been released. Let's take a look at a real-world scenario in which you can use this.

```javascript
let x = 300;
let y = 200;
let dx = 0;
let dy = 0;

const demoRect = new r.Rect(x, y, 50, 50, "green");
rge.addEntity(demoRect);

rge.addKeyPressAction({
    'w': {
        press: () => {
            dy -= 5
        },
        release: () => {
            dy = 0
        }
    },
    'a': {
        press: () => {
            dx -= 5
        },
        release: () => {
            dx = 0
        }
    },
    's': {
        press: () => {
            dy += 5
        },
        release: () => {
            dy = 0
        }
    },
    'd': {
        press: () => {
            dx += 5
        },
        release: () => {
            dx = 0
        }
    },
})

function tick() {
    x += dx;
    y += dy;

    demoRect.update(x, y)
}

rge.setTickFunction(tick);
rge.start();
```

This code creates a `Rect` entity, and allows the user to control it by using WASD.

#### Mouse Inputs
RGE.js also tracks mouse clicks, and provides a utility to add an `onClick` function to certain Entities. By default, all entities which extend the `Entity` object have a click handler built in. Let's take a look at this.

```javascript
// Initializing and registering Rect entity
const startBtn = new r.Rect(650, 500, 400, 100, "red")
rge.addEntity(startBtn)

// Adding an onClick function to the Entity
startBtn.onClick = () => {
    // Start Game logic here
    console.log("Start Button Clicked!")
}
// Register the click handler to the RGE object
rge.addMouseClickHandler(startBtn);
```
Great! As you can see, this allows Rect's to be turned into clickable buttons, which can be used to initialize games.

#### Mouse X and Mouse Y
RGE.js provides a utility to access the mouse's X and Y coordinates. (Works with mobile, but not recommended). Let's see an example of making a rect follow the mouse pointer.

```javascript
let x = 0;
let y = 0;
const rect = new r.Rect(x, y, 50, 50, "red");
rge.addEntity(rect);

function tick() {
    // We do minus 25, since (0,0) is in the top left. This makes the rect centered in the mouse pointer.
    x = rge.mouseX - 25;
    y = rge.mouseY - 25;

    rect.update(x, y)
}
```

### More Entities

#### Ellipses
Ellipses are also a very commonly used entity. Creating an ellipse is very similar to making a rect.

```javascript
const ellipse = new r.Ellipse(x, y, radius, fillColor)
rge.addEntity(ellipse);

function tick() {
    ellipse.update(newX, newY, newColor);
}
```
Ellipses behave nearly identically to Rect's.

### Collision Basics
Although collisions are traditionally a difficult thing to implement, RGE.js makes it very easy and intuitive. We will take a look at implementing collisions between different `Rect` entities. 

#### Collisions in RGE.js versions > `0.0.5`

```javascript
const rect1 = new r.Rect(x, y, width, height, "red");
const rect2 = new r.Rect(x, y, width, height, "blue");

rge.addEntity(rect1);
rge.addEntity(rect2);

function tick() {
    if (rge.collideRectRect(rect1, rect2)) {
        // Logic for what happens after collision. In this case, we will destroy rect2.
        rge.destroyEntity(rect2);
    }
}

rge.setTickFunction(tick);
```

#### Collisions in RGE.js versions < `0.0.5`
##### ⚠️ Deprecated ⚠️

```javascript
const rect1 = new r.Rect(x, y, width, height, "red");
const rect2 = new r.Rect(x, y, width, height, "blue");

rge.addEntity(rect1);
rge.addEntity(rect2);

function tick() {
    if (rect1.collidesWith(rect2)) {
        // Logic for what happens after collision. In this case, we will destroy rect2.
        rge.destroyEntity(rect2);
    }
}

rge.setTickFunction(tick);
```
Once `rect2` is destroyed, it is removed from the canvas. Since we did not call an `update()` function to rect2 however, you may think that the `rect2` variable will contain stale data about the non-existing rect. However, a value is stored inside the `Rect` object which states if it is destroyed or not. The `collidesWith` function checks if the object is destroyed or not before implementing the collision logic, so collision with destroyed entities can not occur.

### Custom Entities
RGE.js provides a sensible set of premade entities which should suit the needs of most developers. However, if you wish to create your own entity, you are always able to do that.

Entities can be made by extending the `Entity` object (which we went over previously). How do we do this? Let's take a look at making custom Rect entity which has no collisions, and increments it's size every tick.

```javascript
class MyCustomRectEntity extends Entity {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    update() {
        // Incrementing size every update call
        this.width = width+1;
        this.height = height+1;
    }

    render(context) {
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    collisionLogic(otherRect) {
        // Opting out of collisions
        return false;
    }
}

// Using our new entity
const sizeIncreasingRect = new MyCustomRectEntity(50, 50, 300, 70)
rge.addEntity(sizeIncreasingRect)

function tick() {
    sizeIncreasingRect.update()
}
```

You can also directly extend premade entities. For example, instead of making a custom rect as an extension of `Entity`, you can simply extend `Rect` and modify some values.