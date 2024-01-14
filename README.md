# RGE.js
Hello everyone! 👋

RGE.js is a Javascript library for simple and intuitive game development and digital art. It is a great fit, no matter the experience level of the programmer. RGE.js is also completely open source, and is very extensible. 

RGE.js uses the HTML canvas tag in order to render elements. It comes with sensible pre-built objects and components, but is fully expandable, and programmers can easily create their own using RGE.js. 

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

RGE.js is intending to be used in a plain HTML/CSS/JS browser environment. NodeJS and framework compatibility may be added in the future in the form of a seperate package. 

#### Compatibility
HTML/CSS/JS - `Compatible`
ReactJS - `Incompatible`
VueJS - `Untested`
Svelte - `Untested`
Angular - `Untested`

#### Warning❗️
As of right now, RGE.js is still in it's alpha phase and may have bugs/issues. 

## Documentation
RGE.js uses an Object Oriented paradigm. This means the RGE engine class and all Entities are objects and have to be handled as such. 

### Initialization
In order to initialize RGE.js, it is recommended to use the CDN install. rgejs will be added to the global `window` object, which can then be used in other `module` JS files. 

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

Great! You have successfully initialized a new RGE project. Now, let's introduce `Entities`.

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

    collidesWith(otherEntity) {
        return (this.isDestroyed || otherEntity.isDestroyed) ? false : this.collisionLogic(otherEntity);
    }

    // Abstract method to be defined by subclasses
    collisionLogic(otherEntity) {}

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

#### Collision Basics
Although collisions are traditionally a difficult thing to implement, RGE.js makes it very easy and intuitive. We will take a look at implementing collisions between different `Rect` entities. 
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
Once `rect2` is destroyed, it is removed from the canvas. Since we did not call an `update()` function to rect2 however, you may think that the `rect2` letiable will contain stale data about the non-existing rect. However, a value is stored inside the `Rect` object which states if it is destroyed or not. The `collidesWith` function checks if the object is destroyed or not before implementing the collision logic, so collision with destroyed entities can not occur.

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