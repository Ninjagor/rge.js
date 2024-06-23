var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// core/inputs/keyboard/index.js
function addKeyPressAction(actions) {
  const keyStates = this.keyStates;
  const handleKeyPress = (event) => {
    const key = event.key;
    if (!keyStates[key] && actions[key] && actions[key].press) {
      keyStates[key] = true;
      actions[key].press();
    }
  };
  const handleKeyUp = (event) => {
    const key = event.key;
    keyStates[key] = false;
    if (actions[key] && actions[key].release) {
      actions[key].release();
    }
  };
  for (const key in actions) {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("keyup", handleKeyUp);
    setInterval(() => handleKeyHold(this, actions, key), 100);
  }
}
function handleKeyHold(thisref, actions, key) {
  if (thisref.keyStates[key] && actions[key] && actions[key].hold) {
    actions[key].hold();
  }
}

// core/inputs/mouse/index.js
function addMouseClickHandler(handler) {
  this.mouseClickHandlers.push(handler);
}
function handleMouseClick(event) {
  let mouseX;
  let mouseY;
  if (this.renderingOrigin == "topleft") {
    mouseX = event.clientX - this.canvas.getBoundingClientRect().left + this.camx;
    mouseY = event.clientY - this.canvas.getBoundingClientRect().top - this.camy;
  } else {
    const parentRect = this.canvas.parentElement.getBoundingClientRect();
    mouseX = event.clientX - parentRect.left - parentRect.width / 2 + this.camx;
    mouseY = event.clientY - parentRect.top - parentRect.height / 2 - this.camy;
  }
  for (const entity of this.entities) {
    if (entity.hitTest && entity.hitTest(mouseX, mouseY)) {
      entity.onClickHandler();
    }
  }
}
function initMouseTracking(event) {
  if (this.renderingOrigin == "topleft") {
    this.mouseX = event.clientX - this.canvas.getBoundingClientRect().left + this.camx;
    this.mouseY = event.clientY - this.canvas.getBoundingClientRect().top - this.camy;
  } else {
    const parentRect = this.canvas.parentElement.getBoundingClientRect();
    this.mouseX = event.clientX - parentRect.left - parentRect.width / 2 + this.camx;
    this.mouseY = event.clientY - parentRect.top - parentRect.height / 2 - this.camy;
  }
}

// core/collisions/TwoPointDist/index.js
function twoPointDist(x1, y1, x2, y2) {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a * a + b * b);
}

// core/collisions/CollideRectEllipse/index.js
function collideRectEllipse(rect2, ellipse2) {
  const cx = ellipse2.x;
  const cy = ellipse2.y;
  const rx = rect2.x;
  const ry = rect2.y;
  const rw = rect2.width;
  const rh = rect2.height;
  const diameter = ellipse2.radius * 2;
  let testX = cx;
  let testY = cy;
  if (cx < rx) {
    testX = rx;
  } else if (cx > rx + rw) {
    testX = rx + rw;
  }
  if (cy < ry) {
    testY = ry;
  } else if (cy > ry + rh) {
    testY = ry + rh;
  }
  const distance = this.findDistance(cx, cy, testX, testY);
  if (distance <= diameter / 2) {
    return true;
  }
  return false;
}

// core/collisions/CollideRectRect/index.js
function collideRectRect(rect1, rect2) {
  if (rect1.isDestroyed || rect2.isDestroyed) {
    return false;
  }
  const overlapX = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
  const overlapY = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));
  return overlapX > 0 && overlapY > 0;
}

// core/collisions/CollidePointPoly/index.js
function collidePointPoly(px, py, polygon) {
  const vertices = polygon.vertices;
  let collision = false;
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;
    let vc = vertices[current];
    let vn = vertices[next];
    if ((vc.y + polygon.y >= py && vn.y + polygon.y < py || vc.y + polygon.y < py && vn.y + polygon.y >= py) && px < (vn.x + polygon.x - (vc.x + polygon.x)) * (py - (vc.y + polygon.y)) / (vn.y + polygon.y - (vc.y + polygon.y)) + (vc.x + +polygon.x)) {
      collision = !collision;
    }
  }
  return collision;
}

// core/collisions/CollideLineEllipse/index.js
function collideLineEllipse(x1, y1, x2, y2, cx, cy, diameter) {
  let inside1 = this.collidePointEllipse(x1, y1, cx, cy, diameter);
  let inside2 = this.collidePointEllipse(x2, y2, cx, cy, diameter);
  if (inside1 || inside2) return true;
  let distX = x1 - x2;
  let distY = y1 - y2;
  let len = Math.sqrt(distX * distX + distY * distY);
  let dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(len, 2);
  let closestX = x1 + dot * (x2 - x1);
  let closestY = y1 + dot * (y2 - y1);
  let onSegment = this.collidePointLine(closestX, closestY, x1, y1, x2, y2);
  if (!onSegment) return false;
  distX = closestX - cx;
  distY = closestY - cy;
  let distance = Math.sqrt(distX * distX + distY * distY);
  if (distance <= diameter / 2) {
    return true;
  }
  return false;
}

// core/collisions/CollidePointEllipse/index.js
function collidePointEllipse(x, y, cx, cy, d) {
  if (this.findDistance(x, y, cx, cy) <= d / 2) {
    return true;
  }
  return false;
}

// core/collisions/CollidePointLine/index.js
function collidePointLine(px, py, x1, y1, x2, y2, buffer) {
  let d1 = this.findDistance(px, py, x1, y1);
  let d2 = this.findDistance(px, py, x2, y2);
  let lineLen = this.findDistance(x1, y1, x2, y2);
  if (buffer === void 0) {
    buffer = 0.1;
  }
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }
  return false;
}

// core/collisions/CollideEllipsePoly/index.js
function collideEllipsePoly(ellipse2, polygon, interior) {
  const cx = ellipse2.x;
  const cy = ellipse2.y;
  const diameter = ellipse2.radius * 2;
  const vertices = polygon.vertices;
  if (interior === void 0) {
    interior = true;
  }
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;
    let vc = vertices[current];
    let vn = vertices[next];
    let collision = this.collideLineEllipse(vc.x + polygon.x, vc.y + polygon.y, vn.x + polygon.x, vn.y + polygon.y, cx, cy, diameter);
    if (collision) return true;
  }
  if (interior === true) {
    let centerInside = this.collidePointPoly(cx, cy, polygon);
    if (centerInside) return true;
  }
  return false;
}

// core/collisions/CollideLineLine/index.js
function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
  let intersection;
  let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  var intersectionX, intersectionY;
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    if (calcIntersection) {
      intersectionX = x1 + uA * (x2 - x1);
      intersectionY = y1 + uA * (y2 - y1);
    }
    if (calcIntersection) {
      intersection = {
        "x": intersectionX,
        "y": intersectionY
      };
      return intersection;
    } else {
      return true;
    }
  }
  if (calcIntersection) {
    intersection = {
      "x": false,
      "y": false
    };
    return intersection;
  }
  return false;
}

// core/collisions/CollideLineRect/index.js
function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {
  let left, right, top, bottom, intersection;
  if (calcIntersection) {
    left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh, true);
    right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh, true);
    top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry, true);
    bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh, true);
    intersection = {
      "left": left,
      "right": right,
      "top": top,
      "bottom": bottom
    };
  } else {
    left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
    right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
    top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
    bottom = this.collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);
  }
  if (left || right || top || bottom) {
    if (calcIntersection) {
      return intersection;
    }
    return true;
  }
  return false;
}

// core/collisions/CollideRectPoly/index.js
function collideRectPoly(rect2, polygon, interior) {
  const vertices = polygon.vertices;
  const rx = rect2.x;
  const ry = rect2.y;
  const rw = rect2.width;
  const rh = rect2.height;
  if (interior == void 0) {
    interior = true;
  }
  var next = 0;
  for (var current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) next = 0;
    var vc = vertices[current];
    var vn = vertices[next];
    var collision = this.collideLineRect(vc.x + polygon.x, vc.y + polygon.y, vn.x + polygon.x, vn.y + polygon.y, rx, ry, rw, rh);
    if (collision) return true;
    if (interior === true) {
      var inside = this.collidePointPoly(rx, ry, polygon);
      if (inside) return true;
    }
  }
  return false;
}

// core/collisions/CollideEllipseEllipse/index.js
function collideEllipseEllipse(ellipse1, ellipse2) {
  const distance = Math.sqrt((ellipse1.x - ellipse2.x) ** 2 + (ellipse1.y - ellipse2.y) ** 2);
  return distance <= ellipse1.radius + ellipse2.radius;
}

// core/collisions/CollideLinePoly/index.js
function collideLinePoly(x1, y1, x2, y2, vertices) {
  for (let i = 0; i < vertices.length; i++) {
    const x3 = vertices[i].x;
    const y3 = vertices[i].y;
    const x4 = vertices[(i + 1) % vertices.length].x;
    const y4 = vertices[(i + 1) % vertices.length].y;
    if (doLineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4)) {
      return true;
    }
  }
  return false;
}
function doLineSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const det1 = determinant(x1, y1, x2, y2, x3, y3);
  const det2 = determinant(x1, y1, x2, y2, x4, y4);
  const det3 = determinant(x3, y3, x4, y4, x1, y1);
  const det4 = determinant(x3, y3, x4, y4, x2, y2);
  return (det1 > 0 && det2 < 0 || det1 < 0 && det2 > 0) && (det3 > 0 && det4 < 0 || det3 < 0 && det4 > 0);
}
function determinant(x1, y1, x2, y2, x3, y3) {
  return (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
}

// core/collisions/CollidePolyPoly/index.js
function collidePolyPoly(poly1, poly2) {
  const p1 = poly1.vertices;
  const p2 = poly2.vertices;
  let collision = false;
  for (let i = 0; i < p1.length; i++) {
    console.log("testing collision: ", p1[i].x, p1[i].y, poly2);
    if (this.collidePointPoly(p1[i].x + poly1.x, p1[i].y + poly1.y, poly2)) {
      collision = true;
      break;
    }
  }
  for (let i = 0; i < p2.length; i++) {
    if (this.collidePointPoly(p2[i].x + poly2.x, p2[i].y + poly2.y, poly1)) {
      collision = true;
      break;
    }
  }
  return collision;
}

// Entities/Entity.js
var Entity = class {
  /**
   * Creates an instance of the Entity class.
   * @param {number} x - The x-coordinate of the entity.
   * @param {number} y - The y-coordinate of the entity.
   */
  constructor(x, y, zIndex = 0) {
    this.x = x;
    this.y = y;
    this.zIndex = zIndex;
    this.isDestroyed = false;
    this.onClick = null;
    this.class = [];
    this.isCurrentlyBeingDebugged = false;
    this.id = void 0;
  }
  /**
   * Abstract method to be overridden by subclasses for updating the entity.
   * @abstract
   */
  update() {
    throw new Error('Method "update" must be implemented by subclasses');
  }
  addClass(classname) {
    this.class.push(classname);
  }
  removeClass(index) {
    this.class.pop(index);
  }
  addId(id) {
    this.id = id;
  }
  removeId(id) {
    this.id = null;
  }
  modifyId(id) {
    this.id = id;
  }
  /**
   * Abstract method to be overridden by subclasses for rendering the entity.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   * @abstract
   */
  render(context) {
    throw new Error('Method "render" must be implemented by subclasses');
  }
  /**
   * Checks if the entity collides with another entity.
   * @param {Entity} otherEntity - The other entity to check collision with.
   * @returns {boolean} - True if a collision occurs, false otherwise.
   */
  // collidesWith(otherEntity) {
  //     if (this.isDestroyed || otherEntity.isDestroyed) {
  //         return false;
  //     }
  //     return this.collisionLogic(otherEntity);
  // }
  /**
   * Abstract method to be overridden by subclasses for specific collision logic.
   * @param {Entity} otherEntity - The other entity involved in the collision.
   * @returns {boolean} - True if a collision occurs, false otherwise.
   * @abstract
   */
  collisionLogic(otherEntity) {
    throw new Error("Method 'collisionLogic' must be implemented by subclasses.");
  }
  /**
   * Marks the entity as destroyed.
   */
  destroy() {
    this.isDestroyed = true;
  }
  /**
   * Executes the onClick callback if defined.
   */
  onClickHandler() {
    if (this.onClick) {
      this.onClick();
    }
  }
};

// Entities/Ellipse.js
var Ellipse = class extends Entity {
  /**
   * Creates an instance of the Ellipse class.
   * @param {number} x - The x-coordinate of the center of the ellipse.
   * @param {number} y - The y-coordinate of the center of the ellipse.
   * @param {number} radius - The radius of the ellipse.
   * @param {string} [fillColor="red"] - The fill color of the ellipse (default is "red").
   */
  constructor(x, y, radius, fillColor = "red") {
    super(x, y);
    this.radius = radius;
    this.fillColor = fillColor;
    this.debug = false;
  }
  renderDebugBorder(context) {
    const debugBorderColor = "lime";
    context.strokeStyle = debugBorderColor;
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
    context.stroke();
  }
  /**
   * Updates the position, radius, and fill color of the ellipse.
   * @param {number} x - The new x-coordinate of the center of the ellipse.
   * @param {number} y - The new y-coordinate of the center of the ellipse.
   * @param {number} [radius=this.radius] - The new radius of the ellipse.
   * @param {string} [fillColor=this.fillColor] - The new fill color of the ellipse.
   */
  update(x, y, radius = this.radius, fillColor = this.fillColor) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fillColor = fillColor;
  }
  /**
  * Adds a texture to the ellipse.
  * @param {string} textureUrl - The URL of the texture image.
  * @param {string} [fillMode="stretched"] - The fill mode for the texture ("stretched" or "cover").
  */
  setTexture(textureImage, fillMode = "stretched") {
    this.texture = textureImage;
    this.fillMode = fillMode;
    this.renderTexture = true;
  }
  debugMode() {
    this.debug = true;
  }
  /**
   * Renders the ellipse on the canvas with optional texture.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  render(context) {
    if (this.texture) {
      if (this.texture.complete) {
        if (this.fillMode === "cover") {
          this.renderCover(context);
        } else {
          this.renderStretched(context);
        }
      } else {
        this.renderLoadingBackground(context);
      }
    } else {
      context.fillStyle = this.fillColor;
      context.beginPath();
      context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
      context.fill();
    }
    if (this.debug) {
      this.renderDebugBorder(context);
    }
  }
  renderLoadingBackground(context) {
    const loadingBackgroundColor = "gray";
    context.fillStyle = loadingBackgroundColor;
    context.beginPath();
    context.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
    context.fill();
  }
  /**
   * Renders the ellipse with texture using the "stretched" fill mode.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  renderStretched(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.clip();
    context.drawImage(this.texture, this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
    context.restore();
  }
  /**
   * Renders the ellipse with texture using the "cover" fill mode.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  renderCover(context) {
    const aspectRatio = this.texture.width / this.texture.height;
    const targetRadius = this.radius;
    const offsetX = this.x - targetRadius;
    const offsetY = this.y - targetRadius;
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.clip();
    context.drawImage(this.texture, offsetX, offsetY, 2 * targetRadius * aspectRatio, 2 * targetRadius);
    context.restore();
  }
  /**
   * Checks if a point (x, y) is within the ellipse.
   * @param {number} pointX - The x-coordinate of the point.
   * @param {number} pointY - The y-coordinate of the point.
   * @returns {boolean} - True if the point is inside the ellipse, false otherwise.
   */
  hitTest(pointX, pointY) {
    const distance = Math.sqrt((pointX - this.x) ** 2 + (pointY - this.y) ** 2);
    return distance <= this.radius;
  }
};

// Entities/Rect.js
var Rect = class extends Entity {
  /**
   * Creates an instance of the Rect class.
   * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
   * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
   * @param {number} width - The width of the rectangle.
   * @param {number} height - The height of the rectangle.
   * @param {string} [fillColor="blue"] - The fill color of the rectangle (default is "blue").
   */
  constructor(x, y, width, height, fillColor = "blue", data = {}, centered = true) {
    super(x, y);
    this.width = width;
    const { borderWidth = 0, borderColor } = data;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
    this.height = height;
    this.fillColor = fillColor;
    if (centered) {
      this.enableCentered();
    } else {
      this.disableCentered();
    }
    this.debug = false;
  }
  debugMode() {
    this.debug = true;
  }
  renderDebugBorder(context) {
    const debugBorderColor = "#19bf19";
    context.strokeStyle = debugBorderColor;
    context.lineWidth = 2;
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
  renderBorder(context, width, color) {
    if (this.borderWidth < 1) {
      return;
    }
    const borderColor = color;
    context.strokeStyle = borderColor;
    context.lineWidth = width;
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
  enableCentered() {
    this.centered = true;
    this.x = this.x - this.width / 2;
    this.y = this.y - this.height / 2;
  }
  disableCentered() {
    this.centered = false;
    this.x = this.x;
    this.y = this.y;
  }
  /**
   * Updates the position and fill color of the rectangle.
   * @param {number} x - The new x-coordinate of the top-left corner of the rectangle.
   * @param {number} y - The new y-coordinate of the top-left corner of the rectangle.
   * @param {string} [fillColor=this.fillColor] - The new fill color of the rectangle.
   */
  update(x, y, fillColor = this.fillColor) {
    if (this.centered) {
      this.x = x - this.width / 2;
      this.y = y - this.height / 2;
    } else {
      this.x = x;
      this.y = y;
    }
    this.fillColor = fillColor;
  }
  /**
   * Adds a texture to the rectangle.
   * @param {string} textureUrl - The URL of the texture image.
   * @param {string} [fillMode="stretched"] - The fill mode for the texture ("stretched" or "cover").
   */
  setTexture(textureImage, fillMode = "stretched") {
    this.texture = textureImage;
    this.fillMode = fillMode;
    this.renderTexture = true;
  }
  /**
   * Renders the rectangle on the canvas with optional texture.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  render(context) {
    if (this.texture) {
      if (this.texture.complete) {
        if (this.fillMode === "cover") {
          this.renderCover(context);
        } else {
          this.renderStretched(context);
        }
      } else {
        this.renderLoadingBackground(context);
      }
    } else {
      context.fillStyle = this.fillColor;
      context.fillRect(this.x, this.y, this.width, this.height);
      this.renderBorder(context, this.borderWidth, this.borderColor);
    }
    if (this.debug) {
      this.renderDebugBorder(context);
    }
  }
  /**
   * Renders a gray loading background while the texture is loading.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  renderLoadingBackground(context) {
    const loadingBackgroundColor = "gray";
    context.fillStyle = loadingBackgroundColor;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  /**
   * Renders the rectangle with texture using the "stretched" fill mode.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  renderStretched(context) {
    context.drawImage(this.texture, this.x, this.y, this.width, this.height);
  }
  /**
   * Renders the rectangle with texture using the "cover" fill mode.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  renderCover(context) {
    const aspectRatio = this.texture.width / this.texture.height;
    const targetWidth = this.width;
    const targetHeight = this.width / aspectRatio;
    const offsetX = this.x;
    const offsetY = this.y + (this.height - targetHeight) / 2;
    context.drawImage(this.texture, offsetX, offsetY, targetWidth, targetHeight);
  }
  /**
   * Checks if a point (x, y) is within the rectangle.
   * @param {number} pointX - The x-coordinate of the point.
   * @param {number} pointY - The y-coordinate of the point.
   * @returns {boolean} - True if the point is inside the rectangle, false otherwise.
   */
  hitTest(pointX, pointY) {
    return pointX >= this.x && pointX <= this.x + this.width && pointY >= this.y && pointY <= this.y + this.height;
  }
};

// Entities/Text.js
var Text = class extends Entity {
  /**
   * Creates an instance of the Text class.
   * @param {number} x - The x-coordinate of the text position.
   * @param {number} y - The y-coordinate of the text position.
   * @param {string} text - The text content.
   * @param {number} [fontSize=16] - The font size (default is 16).
   * @param {string} [fillStyle="black"] - The fill style for the text (default is "black").
   */
  constructor(x, y, text, fontSize = 16, fillStyle = "black", fontFamily = "Arial") {
    super(x, y);
    this.text = text;
    this.fontSize = fontSize;
    this.font = fontFamily;
    this.fillStyle = fillStyle;
  }
  /**
   * Updates the position, text content, font size, and font family of the text.
   * @param {number} x - The new x-coordinate of the text position.
   * @param {number} y - The new y-coordinate of the text position.
   * @param {string} [text=this.text] - The new text content.
   * @param {number} [fontSize=this.fontSize] - The new font size.
   * @param {string} [font=this.font] - The new font family.
   */
  update(x, y, text = this.text, fontSize = this.fontSize, font = this.font) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.fontSize = fontSize;
    this.font = font;
  }
  getWidth(context) {
    context.font = `${this.fontSize}px ${this.font}`;
    return context.measureText(this.text).width;
  }
  getHeight(context) {
    context.font = `${this.fontSize}px ${this.font}`;
    const textMetrics = context.measureText(this.text);
    return textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
  }
  /**
   * Renders the text on the canvas.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  render(context) {
    context.font = `${this.fontSize}px ${this.font}`;
    context.fillStyle = this.fillStyle;
    context.fillText(this.text, this.x, this.y);
  }
  /**
   * Performs collision logic with another entity.
   * Text entities don't participate in collisions, so this method always returns false.
   * @param {Entity} otherEntity - The other entity for collision detection.
   * @returns {boolean} - Always false for Text entities.
   */
  collisionLogic(otherEntity) {
    return false;
  }
};

// Entities/Polygon.js
var Polygon = class extends Entity {
  constructor(x, y, vertices, fillColor = "green", data = {}) {
    super(x, y);
    const { borderWidth = 0, borderColor = "black" } = data;
    this.vertices = vertices;
    this.fillColor = fillColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.debug = false;
    this.imageRotation = 0;
  }
  debugMode() {
    this.debug = true;
  }
  update(x, y, vertices = this.vertices, fillColor = this.fillColor) {
    this.x = x;
    this.y = y;
    this.vertices = vertices;
    this.fillColor = fillColor;
  }
  getBoundingBox() {
    let minX = this.vertices[0].x + this.x;
    let maxX = this.vertices[0].x + this.x;
    let minY = this.vertices[0].y + this.y;
    let maxY = this.vertices[0].y + this.y;
    for (let i = 1; i < this.vertices.length; i++) {
      const x = this.vertices[i].x + this.x;
      const y = this.vertices[i].y + this.y;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  /**
  * Adds a texture to the polygon.
  * @param {string} textureUrl - The URL of the texture image.
  * @param {string} [fillMode="stretched"] - The fill mode for the texture ("stretched" or "cover").
  */
  setTexture(textureImage, rotation = 0, fillMode = "stretched") {
    this.texture = textureImage;
    this.fillMode = fillMode;
    this.renderTexture = true;
    this.imageRotation = rotation;
  }
  /**
   * Renders the polygon on the canvas with optional texture.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  render(context) {
    if (this.renderTexture && this.texture) {
      if (this.fillMode === "cover") {
        this.renderCover(context);
      } else {
        this.renderStretched(context);
      }
    } else {
      context.fillStyle = this.fillColor;
      context.beginPath();
      context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
      for (let i = 1; i < this.vertices.length; i++) {
        context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
      }
      this.renderBorder(context);
      context.closePath();
      context.fill();
    }
    if (this.debug) {
      this.renderDebugBorder(context);
    }
  }
  renderDebugBorder(context) {
    const debugBorderColor = "lime";
    context.strokeStyle = debugBorderColor;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
    }
    context.closePath();
    context.stroke();
  }
  renderBorder(context) {
    const borderColor = this.borderColor;
    context.strokeStyle = borderColor;
    context.lineWidth = this.borderWidth;
    context.beginPath();
    context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
    }
    context.closePath();
    context.stroke();
  }
  /**
   * Renders the polygon with texture using the "stretched" fill mode.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  renderStretched(context) {
    this.renderCover(context);
  }
  /**
   * Renders the polygon with texture using the "cover" fill mode.
   * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
   */
  renderCover(context) {
    const boundingBox = this.getBoundingBox();
    const targetWidth = boundingBox.width;
    const targetHeight = boundingBox.height;
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.imageRotation * Math.PI / 180);
    context.translate(-this.x, -this.y);
    context.beginPath();
    context.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
    for (let i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x + this.x, this.vertices[i].y + this.y);
    }
    context.closePath();
    context.clip();
    context.drawImage(this.texture, boundingBox.x, boundingBox.y, targetWidth, targetHeight);
    context.restore();
    context.restore();
  }
  hitTest(pointX, pointY) {
    let inside = false;
    for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
      const xi = this.vertices[i].x + this.x;
      const yi = this.vertices[i].y + this.y;
      const xj = this.vertices[j].x + this.x;
      const yj = this.vertices[j].y + this.y;
      const intersect = yi > pointY !== yj > pointY && pointX < (xj - xi) * (pointY - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  collisionLogic(otherEntity) {
    return false;
  }
};

// Entities/Sound.js
var Sound = class {
  constructor(path, loop = false) {
    this.audio = new Audio(path);
    this.loop = loop;
    this.volume = 1;
    this.audio.volume = this.volume;
    if (loop) {
      this.audio.loop = true;
      this.audio.play();
    } else {
      this.audio.addEventListener("ended", () => {
        this.stopSound();
      });
    }
  }
  playSound() {
    if (!this.loop) {
      this.stopSound();
      this.audio.play();
    }
  }
  stopSound() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
  pauseSound() {
    this.audio.pause();
  }
  beginLoop() {
    try {
      const enableLoop = true;
      if (enableLoop) {
        this.audio.loop = true;
        this.audio.play();
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
  }
};

// Entities/Group.js
var Group = class extends Entity {
  constructor(x, y, entities = [], rge) {
    super(x, y);
    this.entities = entities;
    this.offsets = [];
    if (rge && rge instanceof RGE) {
      rge.watch(() => {
        this.entities.forEach((entity, index) => {
          const offsetX = this.offsets[index].x;
          const offsetY = this.offsets[index].y;
          entity.update(x + offsetX, y + offsetY);
        });
      }, [() => this.x, () => this.y]);
    }
  }
  addEntity(entity, offsetX = 0, offsetY = 0) {
    this.entities.push(entity);
    this.offsets.push({ x: offsetX, y: offsetY });
    this.update(this.x, this.y);
  }
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      this.offsets.splice(index, 1);
    }
  }
  update(x, y) {
    this.x = x;
    this.y = y;
    this.entities.forEach((entity, index) => {
      const offsetX = this.offsets[index].x;
      const offsetY = this.offsets[index].y;
      entity.update(x + offsetX, y + offsetY);
    });
  }
  render(context) {
    this.entities.forEach((entity) => {
      entity.render(context);
    });
  }
};

// Entities/Widgets/index.js
var Widgets_exports = {};
__export(Widgets_exports, {
  Button: () => Button,
  Error: () => Error2,
  HTMLBasedPopup: () => HTMLBasedPopup,
  HTMLButton: () => HTMLButton,
  HTMLDiv: () => HTMLDiv,
  HTMLInput: () => HTMLInput,
  UIRect: () => UIRect
});

// Entities/Widgets/UIRect.js
var UIRect = class extends Rect {
  constructor(x, y, width, height, fillColor = "blue", centered = true, borderRadius = 0, borderWidth = 0, borderColor = "blue") {
    super(x, y, width, height, fillColor, centered);
    this.borderRadius = borderRadius;
    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }
  update(x, y, fillColor = this.fillColor) {
    if (this.centered) {
      this.x = x - this.width / 2;
      this.y = y - this.height / 2;
    } else {
      this.x = x;
      this.y = y;
    }
    this.fillColor = fillColor;
  }
  render(context) {
    if (this.texture) {
      if (this.texture.complete) {
        if (this.fillMode === "cover") {
          this.renderCover(context);
        } else {
          this.renderStretched(context);
        }
      } else {
        this.renderLoadingBackground(context);
      }
    } else {
      if (this.borderRadius > 0) {
        this.renderRoundedRect(context, this.x, this.y, this.width, this.height, this.borderRadius, this.fillColor);
      } else {
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    if (this.borderWidth >= 1) {
      this.renderBorder(context, this.borderRadius);
    }
  }
  renderRoundedRect(context, x, y, width, height, borderRadius, fillColor) {
    context.save();
    context.beginPath();
    context.moveTo(x + borderRadius, y);
    context.arcTo(x + width, y, x + width, y + height, borderRadius);
    context.arcTo(x + width, y + height, x, y + height, borderRadius);
    context.arcTo(x, y + height, x, y, borderRadius);
    context.arcTo(x, y, x + width, y, borderRadius);
    context.closePath();
    context.fillStyle = fillColor;
    context.fill();
    context.restore();
  }
  renderBorder(context, borderRadius = 0) {
    const borderColor = this.borderColor;
    context.strokeStyle = borderColor;
    context.lineWidth = this.borderWidth;
    if (borderRadius > 0) {
      context.save();
      context.beginPath();
      context.moveTo(this.x + borderRadius, this.y);
      context.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.height, borderRadius);
      context.arcTo(this.x + this.width, this.y + this.height, this.x, this.y + this.height, borderRadius);
      context.arcTo(this.x, this.y + this.height, this.x, this.y, borderRadius);
      context.arcTo(this.x, this.y, this.x + this.width, this.y, borderRadius);
      context.closePath();
      context.stroke();
      context.restore();
    } else {
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
};

// Entities/Widgets/Button.js
var Button = class extends Entity {
  constructor(x, y, data) {
    super(x, y);
    const { EngineRef, buttonColor = "red", borderRadius = 0, borderWidth = 0, borderColor = "black", text, textSize = 16, textColor = "black", font = "Arial", onClick } = data;
    this.EngineRef = EngineRef;
    this.checkWrongTypeError();
    this.text = text;
    this.textSize = textSize;
    this.textColor = textColor;
    this.font = font;
    this.fillColor = buttonColor;
    this.br = borderRadius;
    this.bw = borderWidth;
    this.bc = borderColor;
    this.onClick = onClick;
    this.groupWrapper = null;
    this.textRef = null;
    this.createEntities();
  }
  checkWrongTypeError(error = null) {
    if (!(this.EngineRef instanceof RGE)) {
      this.alertWrongTypeError();
    } else {
      if (error != null || error != void 0) {
        throw new Error(error);
      }
    }
  }
  alertWrongTypeError() {
    throw new Error(`EngineRef is not of type \`Engine\`. Expected type \`Engine\`. Recieved type \`${typeof this.EngineRef}\``);
  }
  createEntities() {
    try {
      const group = new Group(this.x, this.y);
      this.EngineRef.entities.push(group);
      const text = new Text(this.x, this.y, this.text, this.textSize, this.textColor, this.font);
      this.EngineRef.entities.push(text);
      text.zIndex = 10;
      const textWidth = text.getWidth(this.EngineRef.context);
      const textHeight = text.getHeight(this.EngineRef.context);
      const rect2 = new UIRect(this.x, this.y, textWidth + textWidth * 0.5, textHeight + textHeight * 2, this.fillColor, true, this.br, this.bw, this.bc);
      rect2.zIndex = 0;
      this.EngineRef.entities.push(rect2);
      rect2.onClick = this.onClick;
      this.EngineRef.addMouseClickHandler(rect2);
      group.addEntity(text);
      group.addEntity(rect2);
      text.x = text.x - textWidth / 2;
      text.y = text.y + textHeight / 3 + textHeight / 10;
      this.groupWrapper = group;
      this.textRef = text;
    } catch (error) {
      this.checkWrongTypeError(error);
    }
  }
  update(x, y) {
    this.x = x;
    this.y = y;
    if (this.groupWrapper) {
      this.groupWrapper.update(x, y);
      if (this.textRef) {
        const textWidth = this.textRef.getWidth(this.EngineRef.context);
        const textHeight = this.textRef.getHeight(this.EngineRef.context);
        this.textRef.update(x - textWidth / 2, y + textHeight / 3 + textHeight / 10);
      }
    }
  }
  // No render needed, as the Button Widget simply renders and manages entities, it (by nature) is not a true Entity.
  render(context) {
  }
};

// Entities/Widgets/HTMLBasedPopup.js
var HTMLBasedPopup = class {
  constructor(containerId, contents, data) {
    this.contents = contents;
    this.containerId = containerId;
    const { width = "500px", height = "300px", title = "", startXOffset = 0, startYOffset = 0, customDestructor = () => {
    } } = data || {};
    this.width = width;
    this.height = height;
    this.title = title;
    this.startXOffset = startXOffset;
    this.startYOffset = startYOffset;
    this.customDestructor = customDestructor;
    this.createPopup();
    this.addDraggableZone();
    this.popup.appendChild(this.contents);
  }
  createPopup() {
    this.popup = document.createElement("div");
    this.popup.classList.add("popup");
    document.getElementById(this.containerId).appendChild(this.popup);
    this.popup.style.border = "1px solid #ccc";
    this.popup.style.backgroundColor = "#fff";
    this.popup.style.position = "absolute";
    this.popup.style.padding = "10px";
    this.popup.style.top = "50%";
    this.popup.style.left = "50%";
    this.popup.style.fontFamily = "sans-serif";
    this.popup.style.borderTopLeftRadius = "10px";
    this.popup.style.borderTopRightRadius = "10px";
    this.popup.style.borderBottomLeftRadius = "10px";
    this.popup.style.borderBottomRightRadius = "10px";
    const xTranslate = -50 + this.startXOffset;
    const yTranslate = -50 + this.startYOffset;
    this.popup.style.transform = `translate(${xTranslate}%, ${yTranslate}%)`;
    this.popup.style.height = this.height;
    this.popup.style.width = this.width;
    this.popup.style.paddingTop = "35px";
    this.popup.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  }
  addDraggableZone() {
    const draggableZone = document.createElement("div");
    draggableZone.classList.add("draggable-zone");
    draggableZone.style.height = "25px";
    draggableZone.style.background = "white";
    draggableZone.style.position = "absolute";
    draggableZone.style.top = "0";
    draggableZone.style.left = "0";
    draggableZone.style.background = "rgba(0, 0, 0, 0.01)";
    draggableZone.style.width = "100%";
    draggableZone.style.borderTopLeftRadius = "10px";
    draggableZone.style.borderTopRightRadius = "10px";
    draggableZone.style.borderBottom = "1px solid rgba(0, 0, 0, 0.1)";
    const title = document.createElement(
      "p"
    );
    title.textContent = this.title;
    title.style.position = "absolute";
    title.style.left = "10px";
    title.style.top = "50%";
    title.style.fontSize = "12px";
    title.style.marginTop = "3px";
    title.style.opacity = "40%";
    title.style.fontFamily = "sans-serif";
    title.style.height = "20px";
    title.style.borderRadius = "1000px";
    title.style.transform = "translateY(-50%)";
    draggableZone.appendChild(title);
    const xBtn = document.createElement("button");
    xBtn.style.position = "absolute";
    xBtn.style.right = "5px";
    xBtn.style.top = "50%";
    xBtn.style.width = "20px";
    xBtn.style.height = "20px";
    xBtn.style.borderRadius = "1000px";
    xBtn.style.transform = "translateY(-50%)";
    xBtn.style.border = "none";
    xBtn.style.display = "flex";
    xBtn.style.alignItems = "center";
    xBtn.style.background = "rgba(0, 0, 0, 0.03)";
    xBtn.style.justifyContent = "center";
    xBtn.innerHTML = '<p style="font-size: 13px; display: flex; align-items: center; justify-content: center; opacity: 0.6; font-family: monospace;">x</p>';
    xBtn.style.cursor = "pointer";
    xBtn.addEventListener("mouseenter", () => {
      xBtn.style.background = "rgba(0, 0, 0, 0.1)";
    });
    xBtn.addEventListener("mouseleave", () => {
      xBtn.style.background = "rgba(0, 0, 0, 0.03)";
    });
    xBtn.addEventListener("mousedown", () => {
      xBtn.style.background = "rgba(0, 0, 0, 0.2)";
    });
    xBtn.addEventListener("mouseup", () => {
      xBtn.style.background = "rgba(0, 0, 0, 0.1)";
    });
    xBtn.addEventListener("click", () => {
      this.removePopup();
    });
    draggableZone.appendChild(xBtn);
    this.popup.appendChild(draggableZone);
    let isDragging = false;
    let offsetX, offsetY;
    draggableZone.addEventListener("mousedown", (event) => {
      isDragging = true;
      offsetX = event.clientX - this.popup.offsetLeft;
      offsetY = event.clientY - this.popup.offsetTop;
    });
    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        this.popup.style.left = event.clientX - offsetX + "px";
        this.popup.style.top = event.clientY - offsetY + "px";
      }
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
  removePopup() {
    this.customDestructor();
    this.popup.parentNode.removeChild(this.popup);
    this.popup = null;
  }
};

// Entities/Widgets/Error.js
var Error2 = class {
  constructor(errorHeader = "", errorDetails = "", canvasId = "", affectedFunction = "") {
    this.errorHeader = errorHeader;
    this.errorDetails = errorDetails;
    this.affectedFunction = affectedFunction;
    this.canvasId = canvasId;
    this.renderError();
  }
  renderError() {
    const parent = document.getElementById(this.canvasId).parentElement;
    const errorPopup = document.createElement("div");
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
        `;
    parent.innerHTML = "";
    parent.appendChild(errorPopup);
  }
};

// Entities/Widgets/HTMLButton.js
var HTMLButton = class {
  constructor(x, y, data = {}) {
    const { canvasId = "", text = "", onClick = () => {
    }, style = "", id = `btn-${JSON.stringify(Math.random() * 100)}` } = data;
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
    const button = `<button onclick="${this.onClick}" style="position: absolute; left: ${this.x}px; top: ${this.y}px;" id="${this.id}">Hello</button>`;
    const parent = document.getElementById(this.canvasId).parentElement;
    const btn = document.createElement("button");
    btn.textContent = this.text;
    btn.onclick = this.onClick;
    btn.style.left = `${this.x}px`;
    btn.style.position = `absolute`;
    btn.style.top = `${this.y}px`;
    btn.id = this.id;
    const styles = this.style.split(";").filter((s) => s.trim() !== "");
    styles.forEach((style) => {
      const [property, value] = style.split(":").map((s) => s.trim());
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
};

// Entities/Widgets/HTMLInput.js
var HTMLInput = class {
  constructor(x, y, data = {}) {
    const { canvasId = "", placeholder = "", style = "", id = `input-${JSON.stringify(Math.random() * 1e4)}` } = data;
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
    const input = document.createElement("input");
    input.placeholder = this.placeholder;
    input.style.left = `${this.x}px`;
    input.style.position = `absolute`;
    input.style.top = `${this.y}px`;
    input.id = this.id;
    const styles = this.style.split(";").filter((s) => s.trim() !== "");
    styles.forEach((style) => {
      const [property, value] = style.split(":").map((s) => s.trim());
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
};

// Entities/Widgets/HTMLDiv.js
var HTMLDiv = class {
  constructor(x, y, data = {}) {
    const { canvasId = "", style = "", id = `div-${JSON.stringify(Math.random() * 1e4)}` } = data;
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
    const div = document.createElement("div");
    div.style.left = `${this.x}px`;
    div.style.position = `absolute`;
    div.style.top = `${this.y}px`;
    div.id = this.id;
    const styles = this.style.split(";").filter((s) => s.trim() !== "");
    styles.forEach((style) => {
      const [property, value] = style.split(":").map((s) => s.trim());
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
};

// Entities/PolyBased/index.js
var PolyBased_exports = {};
__export(PolyBased_exports, {
  PBRect: () => PBRect
});

// Entities/PolyBased/PBRect.js
var PBRect = class extends Entity {
  constructor(x, y, data) {
    super(x, y);
    const { EngineRef, width, height, rotation = 0, fillColor = "red", borderWidth = 0, borderColor = "black" } = data;
    if (!EngineRef || !(EngineRef instanceof RGE)) {
      throw new Error("EngineRef is required as instance of Engine.");
    }
    if (!width || !height) {
      throw new Error("`width` and `height` are mandatory fields.");
    }
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.fillColor = fillColor;
    this.EngineRef = EngineRef;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
    this.polyrectRef = null;
    this.generatePoly();
  }
  generatePoly() {
    const rotatedRectVertices = this.calculateRotatedRectVertices(this.x, this.y, this.width, this.height, this.rotation);
    const rotatedRectPolygon = new Polygon(this.x, this.y, rotatedRectVertices, this.fillColor, {
      borderWidth: this.borderWidth,
      borderColor: this.borderColor
    });
    this.polyrectRef = rotatedRectPolygon;
    this.EngineRef.entities.push(rotatedRectPolygon);
  }
  calculateRotatedRectVertices(x, y, width, height, angle) {
    x = 1;
    y = 1;
    const radians = angle * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const x1 = x - width / 2;
    const y1 = y - height / 2;
    const x2 = x + width / 2;
    const y2 = y - height / 2;
    const x3 = x + width / 2;
    const y3 = y + height / 2;
    const x4 = x - width / 2;
    const y4 = y + height / 2;
    const rotatedX1 = x + (x1 - x) * cos - (y1 - y) * sin;
    const rotatedY1 = y + (x1 - x) * sin + (y1 - y) * cos;
    const rotatedX2 = x + (x2 - x) * cos - (y2 - y) * sin;
    const rotatedY2 = y + (x2 - x) * sin + (y2 - y) * cos;
    const rotatedX3 = x + (x3 - x) * cos - (y3 - y) * sin;
    const rotatedY3 = y + (x3 - x) * sin + (y3 - y) * cos;
    const rotatedX4 = x + (x4 - x) * cos - (y4 - y) * sin;
    const rotatedY4 = y + (x4 - x) * sin + (y4 - y) * cos;
    return [
      { x: rotatedX1, y: rotatedY1 },
      { x: rotatedX2, y: rotatedY2 },
      { x: rotatedX3, y: rotatedY3 },
      { x: rotatedX4, y: rotatedY4 }
    ];
  }
  update(x, y, data) {
    const { width = this.width, height = this.height, rotation = this.rotation, fillColor = this.fillColor } = data || {};
    if (this.polyrectRef) {
      this.polyrectRef.update(x, y);
      const rotatedRectVertices = this.calculateRotatedRectVertices(this.polyrectRef.x, this.polyrectRef.y, width, height, rotation);
      this.polyrectRef.vertices = rotatedRectVertices;
      this.polyrectRef.fillColor = fillColor;
    }
  }
};

// core/rendering/renderEntities/index.js
function renderEntities() {
  this.entities.sort((a, b) => {
    return a.zIndex - b.zIndex;
  });
  this.customZSort();
  if (this.renderingOrigin == "topleft") {
    for (const entity of this.entities) {
      this.context.save();
      this.context.translate(-this.camx, this.camy);
      entity.render(this.context);
      this.context.restore();
    }
  } else {
    for (const entity of this.entities) {
      this.context.save();
      this.context.translate(this.canvas.width / 2 - this.camx, this.canvas.height / 2 + this.camy);
      entity.render(this.context);
      this.context.restore();
    }
  }
}

// core/rendering/initUtils/start/index.js
async function start() {
  this.isStopped = false;
  this.canvasLoadingView();
  if (!this.preloadExecuted) {
    await this.preload();
  }
  if (!this.setupExecuted) {
    this.setup();
  }
  this.updateAssetLoadingCount();
  setTimeout(() => {
    this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }, Object.keys(this.preloadedImages).length * (this.textureLoadingTime / Object.keys(this.preloadedImages).length));
}

// core/rendering/initUtils/configure/index.js
function configure(configuration = {}) {
  const { preload, setup, tick, centeredOrigin } = configuration;
  if (preload) {
    this.setPreload(preload);
  }
  if (setup) {
    this.setupFunction(setup);
  }
  if (tick) {
    this.setTickFunction(tick);
  }
  if (centeredOrigin === true) {
    this.setCenterOrigin();
  }
}

// core/loading/loadImage/index.js
async function loadImage(imageUrl) {
  if (this.preloadExecuted) {
    throw new Error("loadImage can only be used in preload()");
    return;
  }
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const image = new Image();
    image.src = URL.createObjectURL(blob);
    const imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    this.preloadedImages[imageName] = image;
    return image;
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
}

// core/loading/canvasLoadingView/index.js
function canvasLoadingView() {
  this.clearCanvas();
  const entity = new Text(0, 0, `Loading assets...`, 30, "black");
  entity.update(0 - entity.getWidth(this.context) / 2, 0);
  this.context.save();
  this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
  entity.render(this.context);
  this.context.restore();
}

// core/loading/updateAssetLoadingCount/index.js
function updateAssetLoadingCount() {
  let i = 0;
  const interval = setInterval(() => {
    this.canvasLoadingView();
    this.loadedAssetsCount += 1;
    if (!(i < Object.keys(this.preloadedImages).length)) {
      clearInterval(interval);
    }
    i++;
  }, this.textureLoadingTime / Object.keys(this.preloadedImages).length);
}

// core/loading/loadFont/index.js
async function loadFont(fontUrl, fontName) {
  if (this.preloadExecuted) {
    throw new Error("loadFont can only be used in preload()");
    return;
  }
  try {
    const response = await fetch(fontUrl);
    console.log(response);
    const fontBlob = await response.blob();
    console.log(fontBlob);
    const fontFace = new FontFace(fontName, fontBlob);
    await fontFace.load();
    document.fonts.add(fontFace);
    this.preloadedFonts[fontName] = fontFace;
    return fontFace;
  } catch (error) {
    console.error("Error loading font:", error);
    return null;
  }
}
async function loadGoogleFont(fontUrl, fontName) {
  if (this.preloadExecuted) {
    throw new Error("loadFont can only be used in preload()");
    return;
  }
  try {
    const response = await fetch(fontUrl);
    const cssText = await response.text();
    const fontUrlMatch = cssText.match(/url\(([^)]+)\)/);
    if (!fontUrlMatch || fontUrlMatch.length < 2) {
      throw new Error("Font URL not found in CSS");
    }
    const actualFontUrl = fontUrlMatch[1].replace(/['"]/g, "");
    const fontFace = new FontFace(fontName, `url(${actualFontUrl})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    this.preloadedFonts[fontName] = fontFace;
    return fontFace;
  } catch (error) {
    console.error("Error loading font:", error);
    return null;
  }
}

// core/localdata/index.js
var localdata_exports = {};
__export(localdata_exports, {
  get: () => get,
  push: () => push,
  remove: () => remove,
  update: () => update
});

// core/localdata/get/index.js
function get(itemId) {
  try {
    const item = localStorage.getItem(itemId);
    return JSON.parse(item);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// core/localdata/remove/index.js
function remove(itemName) {
  try {
    const item = localStorage.removeItem(itemName);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// core/localdata/push/index.js
function push(itemName, itemVal) {
  try {
    const item = localStorage.setItem(itemName, JSON.stringify(itemVal));
    return item;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// core/localdata/update/index.js
function update(itemName, newVal) {
  try {
    const removed = localStorage.removeItem(itemName);
    const newItem = localStorage.setItem(itemName, JSON.stringify(newVal));
    return newItem;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

// core/eventbus/index.js
var EventBus = class {
  constructor(rge) {
    this.events = [];
    this.callbackRegistry = [];
    this.canvasId = rge.canvasId;
  }
  emit(event) {
    this.events.push(event);
  }
  subscribe(subName, subEvent, callback) {
    if (!subName || !subEvent || !callback) {
      throw new Error2("invalid subcription to EventBus");
    }
    try {
      this.callbackRegistry.push({ subName, subEvent, callback });
      console.log(this.callbackRegistry);
    } catch (error) {
      console.error(error);
      throw new Error2("invalid subcription to EventBus");
    }
  }
  unsubscribe(subName) {
    const registry = [];
    for (const clb of this.callbackRegistry) {
      if (!(clb.subName == subName)) {
        registry.push(clb);
      }
    }
    this.callbackRegistry = registry;
  }
  process() {
    for (const event of this.events) {
      for (const clb of this.callbackRegistry) {
        if (clb.subEvent == event) {
          try {
            clb.callback();
          } catch (error) {
            new Error2("EventBus Callback Error", `The callback provided for subscribed event "${event}" has failed. <br><br> <br> Instigating Callback: <br><br> ${clb.callback}. <br><br> ${error} <br><br><br> Fix this error or remove the instigating callback to remove this message. <br><br>`, this.canvasId, "subscribe()");
            const _error = new Error2("Error: Callback for event in EventBus failed.");
            _error.name = "";
            throw _error;
          }
        }
      }
    }
    this.events = [];
  }
};

// core/index.js
var RGE = class {
  constructor(canvasId, targetFps = 60, data = {}) {
    const { isEmbedded = false, __fcm__ = false, maxEntities = 500, webGLMode = false } = data;
    this.isEmbedded = isEmbedded;
    this.canvas = document.getElementById(canvasId);
    if (this.isEmbedded) {
      this.canvas.setAttribute("data-entities", JSON.stringify([]));
    }
    if (!__fcm__) {
      console.warn("Your code contains a raw Engine instantiation, which is not recommended for larger scale projects. Use SceneManager instead. To ignore, set __fcm__ to true in your Engine instantiation.");
    }
    this.maxEntities = maxEntities;
    this.canvasId = canvasId;
    if (webGLMode) {
      this.context = this.canvas.getContext("webgl");
    } else {
      this.context = this.canvas.getContext("2d");
    }
    this.webGLMode = webGLMode;
    this.entities = [];
    this.tickFunction = () => {
    };
    this.targetFps = targetFps;
    this.targetFrameTime = 1e3 / targetFps;
    this.lastTimestamp = 0;
    this.deltaAccumulator = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.addKeyPressAction = addKeyPressAction.bind(this);
    this.addMouseClickHandler = addMouseClickHandler.bind(this);
    this.handleMouseClick = handleMouseClick.bind(this);
    this.keyStates = {};
    this.mouseClickHandlers = [];
    this.canvas.addEventListener("mousedown", this.handleMouseClick.bind(this));
    this.collideRectRect = collideRectRect.bind(this);
    this.collideRectEllipse = collideRectEllipse.bind(this);
    this.collidePointPoly = collidePointPoly.bind(this);
    this.findDistance = twoPointDist.bind(this);
    this.initMouseTracking = initMouseTracking.bind(this);
    this.canvas.addEventListener("mousemove", this.initMouseTracking.bind(this));
    this.collideLineEllipse = collideLineEllipse.bind(this);
    this.collidePointEllipse = collidePointEllipse.bind(this);
    this.collidePointLine = collidePointLine.bind(this);
    this.collideEllipsePoly = collideEllipsePoly.bind(this);
    this.collideLineLine = collideLineLine.bind(this);
    this.collideLineRect = collideLineRect.bind(this);
    this.collideRectPoly = collideRectPoly.bind(this);
    this.collideEllipseEllipse = collideEllipseEllipse.bind(this);
    this.collideLinePoly = collideLinePoly.bind(this);
    this.collidePolyPoly = collidePolyPoly.bind(this);
    this.animationFrameId = null;
    window.addEventListener("resize", this.handleResize);
    this.resizeCanvas();
    this.renderingOrigin = "topleft";
    this.customZSort = () => {
    };
    this.canvas.addEventListener("mousedown", () => {
      this.isMouseDown = true;
    });
    this.canvas.addEventListener("mouseup", () => {
      this.isMouseDown = false;
    });
    this.backgroundColor = null;
    this.backgroundImage = null;
    this.backgroundRepeat = null;
    this.backgroundSize = null;
    this.preloadExecuted = false;
    this.preload = async () => {
      await this.customPreload();
      this.preloadExecuted = true;
    };
    this.customPreload = async () => {
    };
    this.preloadedImages = {};
    this.preloadedFonts = {};
    this.customPreloadFunction = null;
    this.setupExecuted = false;
    this.customSetup = () => {
    };
    this.loadedAssetsCount = 0;
    this.textureLoadingTime = 0;
    this.setup = () => {
      this.customSetup();
      this.setupExecuted = true;
    };
    this.renderEntities = renderEntities.bind(this);
    this.start = start.bind(this);
    this.configure = configure.bind(this);
    this.loadImage = loadImage.bind(this);
    this.loadFont = loadFont.bind(this);
    this.loadGoogleFont = loadGoogleFont.bind(this);
    this.canvasLoadingView = canvasLoadingView.bind(this);
    this.updateAssetLoadingCount = updateAssetLoadingCount.bind(this);
    this.watchedVariables = [];
    this.debugWatchedEntities = [];
    this.debugWatchedEntitiesBackup = [];
    this.loggingDevMode = false;
    this.localdata = localdata_exports;
    this.EventBus = EventBus;
    this.isStopped = false;
    this.camx = 0;
    this.camy = 0;
  }
  print(output, type = "log") {
    if (type == "error") {
      console.error(output);
    } else if (type == "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }
  }
  setPreload(preloadFunction) {
    this.customPreload = preloadFunction;
  }
  arraysEqual(a, b) {
    return a.length === b.length && a.every((value, index) => value === b[index]);
  }
  watch(callback, dependencies) {
    if (!Array.isArray(dependencies)) {
      new Error2("Dependency Array Error: Invalid Dependencies", `The dependencies which you provided: <br> <br> '${dependencies}' <br> <br> is not an array of callback functions. Please follow the format: <br> <br> '[() => watchedVar]'`, this.canvasId, "watch()");
      const error = new Error2("Error: Dependencies must be an array of functions. For example: [() => watchedVar]");
      error.name = "";
      throw error;
    }
    this.watchedVariables.push({ dependencies, callback, lastValues: dependencies.map((dep) => typeof dep === "function" ? dep() : dep) });
  }
  checkWatchedVariables() {
    for (const watchItem of this.watchedVariables) {
      const { dependencies, callback } = watchItem;
      if (!Array.isArray(dependencies)) {
        new Error2("Dependecy Array Error: Invalid Dependencies", `The dependencies which you provided: <br> <br> '${dependencies}' <br> <br> is not an array of callback functions. Please follow the format: <br> <br> '[() => watchedVar]'`, this.canvasId, "watch()");
        const error = new Error2("Error: Dependencies must be an array of functions. For example: [() => watchedVar]");
        error.name = "";
        throw error;
      }
      const currentValues = dependencies.map((dep) => typeof dep === "function" ? dep() : dep);
      if (!Array.isArray(dependencies) || dependencies.some((dep) => typeof dep !== "function")) {
        new Error2("Dependecy Array Error: Invalid Dependencies", `The dependencies which you provided: <br> <br> '${JSON.stringify(dependencies)}' <br> <br> is not an array of callback functions. Please follow the format: <br> <br> '[() => watchedVar]'`, this.canvasId, "watch()");
        const error = new Error2("Error: Dependencies must be an array of functions. For example: [() => watchedVar]");
        error.name = "";
        throw error;
      }
      if (!this.arraysEqual(currentValues, watchItem.lastValues)) {
        callback();
        watchItem.lastValues = currentValues;
      }
    }
  }
  enableDevMode(loggingDevMode = false) {
    console.warn("Dev mode is enabled. This may cause certain security features to be disabled, and may result in unexpected errors. In order to properly utilize devMode, make sure you call it at the TOP of your file (or right after you define `rge`).");
    if (loggingDevMode) {
      try {
        this.loggingDevMode = true;
      } catch (error) {
        console.error(error);
      }
    }
    this.textureLoadingTime = 0;
  }
  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
  }
  getWidth() {
    return this.canvas.width * 2;
  }
  getHeight() {
    return this.canvas.height * 2;
  }
  debugEntity(entity, offsetY = 10) {
    const debugText = new Text(entity.x, entity.y, entity.id ? entity.id : "unnamed_entity", 13, "green");
    this.addEntity(debugText);
    entity.isCurrentlyBeingDebugged = true;
    debugText.zIndex = 100;
    const centerMarker = new Ellipse(entity.x, entity.y, 3, "black");
    this.addEntity(centerMarker);
    try {
      entity.debugMode();
    } catch (error) {
      console.warn("Entity does not implement a debug border. If this is a Text entity, Group Entity, or a custom entity, ignore.");
    }
    centerMarker.zIndex = 100;
    this.debugWatchedEntities.push({
      text: debugText,
      entity,
      centerMarker,
      offsetY
    });
  }
  disableAllEntityDebugs() {
    this.debugWatchedEntitiesBackup = this.debugWatchedEntities;
    this.debugWatchedEntities = [];
  }
  reEnableAllEntityDebugs() {
    this.debugWatchedEntities = this.debugWatchedEntitiesBackup;
  }
  handleResize = () => {
    this.resizeCanvas();
  };
  stop() {
    this.isStopped = true;
    this.entities = [];
    this.keyPressActions = {};
    this.pressedKeys = {};
    this.mouseClickHandlers = [];
    this.tickFunction = () => {
    };
    cancelAnimationFrame(this.animationFrameId);
  }
  addEntity(entity) {
    if (this.entities.length + 1 > this.maxEntities) {
      new Error2("Entity Overflow Error", `The current engine is currently holding <br><br> ${this.entities.length} <br><br> entities, which is the set limit. In order to increase the limit, please add <br><br>
            maxEntities: (desiredMax) <br><br> to the constructor of the engine OR, add <br><br>
            (engine).maxEntities = (desiredMax) <br><br> to your code. If you would like to remove this limit, please set maxEntities to Infinity.`, this.canvasId, "addEntity()");
      const error = new Error2("Entity Overflow Error: Entities array has reached its limit. Modify the engine maxEntities value.");
      error.name = "";
      throw error;
    }
    this.entities.push(entity);
  }
  setTickFunction(tickFunction) {
    this.tickFunction = tickFunction;
  }
  setupFunction(setupFunc) {
    this.customSetup = setupFunc;
  }
  gameLoop(timestamp) {
    if (this.isStopped) {
      this.clearCanvas();
      return;
    } else {
      if (this.preloadExecuted && this.setupExecuted) {
        if (!this.lastTimestamp) {
          this.lastTimestamp = timestamp;
        }
        if (this.isEmbedded) {
          const entityData = JSON.stringify(this.entities);
          this.canvas.setAttribute("data-entities", entityData);
        }
        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.deltaAccumulator += deltaTime;
        if (this.isStopped) {
          return;
        }
        while (this.deltaAccumulator >= this.targetFrameTime) {
          this.tickFunction();
          this.clearCanvas();
          this.renderEntities();
          this.checkWatchedVariables();
          for (const i in this.debugWatchedEntities) {
            let currIndex = this.debugWatchedEntities[i];
            if (currIndex.isDestroyed == true) {
              this.debugWatchedEntities.pop(i);
              break;
            }
            try {
              currIndex.text.update(currIndex.entity.x - currIndex.text.getWidth(this.context) / 2, currIndex.entity.y - currIndex.offsetY, (currIndex.entity.id ? currIndex.entity.id : "unnamed_entity") + ` x: ${Math.round(currIndex.entity.x)}, y: ${Math.round(currIndex.entity.y)}; ${currIndex.entity instanceof Group ? `children: ${currIndex.entity.entities.length}` : ""}`, 13, "monospace");
              currIndex.centerMarker.update(currIndex.entity.x, currIndex.entity.y);
            } catch (error) {
              console.error(error);
            }
          }
          this.deltaAccumulator -= this.targetFrameTime;
        }
        this.animationFrameId = requestAnimationFrame((timestamp2) => this.gameLoop(timestamp2));
      }
    }
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  destroyEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      entity.destroy();
    }
  }
  setCenterOrigin() {
    this.renderingOrigin = "center";
  }
  resetOrigin() {
    this.renderingOrigin = "topleft";
  }
  customZSort() {
  }
  setBackground(options = {}) {
    const { color = null, image = null, repeat = null } = options;
    this.backgroundColor = color;
    this.backgroundImage = image;
    this.backgroundRepeat = repeat;
    if (color) {
      this.canvas.style.backgroundColor = color;
    } else if (image) {
      let backgroundStyle = `url(${image})`;
      if (repeat) {
        backgroundStyle += ` ${repeat}`;
      }
      backgroundStyle += ` / 100% 100%`;
      this.canvas.style.background = backgroundStyle;
    } else {
      this.canvas.style.backgroundColor = null;
      this.canvas.style.background = null;
    }
  }
};

// Managers/Scene.js
var Scene = class {
  constructor(canvasId, fps = 120) {
    this.engine = new RGE(canvasId, fps, {
      __fcm__: true
    });
  }
  configure(configuration = {}) {
    const { preload = () => {
    }, setup = () => {
    }, tick = () => {
    }, centeredOrigin = false, maxEntities = 500, webGLMode = false } = configuration;
    if (webGLMode) {
      this.engine.webGLMode = true;
      this.engine.context = this.engine.canvas.getContext("webgl");
    }
    this.engine.maxEntities = maxEntities;
    this.engine.configure({
      preload,
      setup,
      tick,
      centeredOrigin
    });
  }
  start() {
    this.engine.start();
  }
  stop() {
    console.log(this.engine);
    this.engine.tickFunction = () => {
      console.warn("WSP FAM");
    };
    console.log(this.engine);
  }
};

// Managers/Camera.js
var Camera = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  update(x, y) {
    this.x = x;
    this.y = y;
  }
};

// Managers/CameraManager.js
var CameraManager = class {
  constructor(engineRef) {
    if (!(engineRef instanceof RGE)) {
      throw new Error("Expected engineRef to be instanceof Engine.");
    }
    this.engineRef = engineRef;
    this.cameras = {};
    this.currentCamera = null;
  }
  addCamera(cameraName, camera) {
    if (!(camera instanceof Camera)) {
      throw new Error("addCamera expects type Camera");
    }
    if (this.cameras[cameraName]) {
      throw new Error("Camera with that name already exists");
    }
    this.cameras[cameraName] = camera;
  }
  setCamera(cameraName) {
    if (!this.cameras[cameraName]) {
      throw new Error("Camera with that name does not exist");
    }
    this.currentCamera = this.cameras[cameraName];
    this.activateCamera();
  }
  updateCamera(cameraName, x = 0, y = 0) {
    if (!this.cameras[cameraName]) {
      throw new Error("Camera with that name does not exist");
    }
    this.cameras[cameraName].update(x, y);
    this.currentCamera = this.cameras[cameraName];
    this.activateCamera();
    return this.cameras[cameraName];
  }
  activateCamera() {
    try {
      this.engineRef.camx = this.currentCamera.x;
      this.engineRef.camy = this.currentCamera.y;
    } catch (e) {
      console.error(e);
    }
  }
  shakeEffect(cameraName, duration, shakeIntensity) {
    for (let i = 0; i < duration * 100; i++) {
      setTimeout(() => {
        const offsetX = Math.random() * shakeIntensity - shakeIntensity / 2;
        const offsetY = Math.random() * shakeIntensity - shakeIntensity / 2;
        this.updateCamera(cameraName, offsetX, offsetY);
      }, i * 10);
    }
  }
};

// Managers/SceneManager.js
var SceneManager = class {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
    this.currentEngine = null;
    this.cameraManager = null;
  }
  addScene(sceneName, scene, configuration) {
    if (!(scene instanceof Scene)) {
      throw new Error("Add scene expects type Scene");
    }
    if (this.scenes[sceneName]) {
      throw new Error("Scene with that name already exists");
    }
    this.scenes[sceneName] = [scene, configuration];
    this.scenes[sceneName][0].configure(this.scenes[sceneName][1]);
    this.currentEngine = this.scenes[sceneName][0].engine;
  }
  setScene(sceneName) {
    if (!this.scenes[sceneName]) {
      throw new Error("Scene with that name does not exist");
    }
    this.currentScene = this.scenes[sceneName];
    this.currentEngine = this.currentScene[0].engine;
    if (this.cameraManager) {
      this.cameraManager.engineRef = this.currentEngine;
      this.cameraManager.activateCamera();
    }
    this.startScene();
  }
  startScene() {
    if (this.currentScene) {
      this.currentScene[0].configure(this.currentScene[1]);
      this.currentScene[0].start();
    }
  }
  addCameraManager(cameraManager) {
    if (!(cameraManager instanceof CameraManager)) {
      throw new Error("Expected instanceof CameraManager.");
    }
    this.cameraManager = cameraManager;
  }
};

// Managers/StateManager.js
var StateManager = class {
  constructor() {
    this.states = {};
  }
  addState(key, value) {
    this.states[key] = value;
  }
  getState(key) {
    if (this.states[key]) {
      return this.states[key];
    }
    return null;
  }
  removeState(key) {
    this.states[key] = null;
  }
  watchState(key, engineRef, callback) {
    if (!(engineRef instanceof RGE)) {
      throw new Error("Expected engineRef to be instance of Engine.");
    }
    engineRef.watch(callback, [() => this.states[key]]);
  }
};

// Managers/EntityManager.js
var EntityManager = class {
  constructor(engineRef = null) {
    this.engineRef = engineRef;
    if (!engineRef instanceof RGE) {
      throw new Error("Expected engine ref to be of type Engine.");
    }
    this.entity = null;
    this.hitbox = null;
  }
  setEntity(entity) {
    this.entity = entity;
  }
  setHitbox(hitbox) {
    this.hitbox = hitbox;
    if (this.entity) {
      this.engineRef.watch(() => {
        this.hitbox.x = this.entity.x;
        this.hitbox.y = this.entity.y;
      }, [() => this.entity.x, () => this.entity.y]);
    }
  }
  render() {
    if (this.entity) {
      this.engineRef.addEntity(this.entity);
    }
    if (this.hitbox) {
      this.engineRef.addEntity(this.hitbox);
    }
  }
  destroy() {
    if (this.entity) {
      this.engineRef.destroyEntity(this.entity);
    }
    if (this.hitbox) {
      this.engineRef.destroyEntity(this.hitbox);
    }
  }
};

// Managers/TextureManager.js
var TextureManager = class {
  constructor(entity) {
    this.entity = entity;
    this.currentTexture = 0;
    this.textures = [];
  }
  addTexture(texture) {
    this.textures.push(texture);
  }
  applyTexture(textureNumber) {
    this.currentTexture = textureNumber;
    this.entity.setTexture(this.textures[textureNumber]);
  }
  removeTexture() {
    this.entity.setTexture(null);
  }
  nextTexture() {
    if (this.currentTexture < this.textures.length - 1) {
      this.currentTexture += 1;
    } else {
      this.currentTexture = 0;
    }
    this.applyTexture(this.currentTexture);
  }
  prevTexture() {
    if (this.currentTexture > 0) {
      this.currentTexture -= 1;
    } else {
      this.currentTexture = 0;
    }
    this.applyTexture(this.currentTexture);
  }
};

// compiler/index.js
var compiler_exports = {};
__export(compiler_exports, {
  compile: () => compile,
  evalBytecode: () => evalBytecode,
  generateAST: () => peg$parse
});

// compiler/grammar.js
function peg$subclass(child, parent) {
  function C() {
    this.constructor = child;
  }
  C.prototype = parent.prototype;
  child.prototype = new C();
}
function peg$SyntaxError(message, expected, found, location) {
  var self = Error.call(this, message);
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location;
  self.name = "SyntaxError";
  return self;
}
peg$subclass(peg$SyntaxError, Error);
function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}
peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var offset_s = this.location.source && typeof this.location.source.offset === "function" ? this.location.source.offset(s) : s;
    var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", offset_s.line.toString().length, " ");
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = last - s.column || 1;
      str += "\n --> " + loc + "\n" + filler + " |\n" + offset_s.line + " | " + line + "\n" + filler + " | " + peg$padEnd("", s.column - 1, " ") + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};
peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },
    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
      });
      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected2) {
    var descriptions = expected2.map(describeExpectation);
    var i, j;
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found2) {
    return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  var peg$FAILED = {};
  var peg$source = options.grammarSource;
  var peg$startRuleFunctions = { start: peg$parsestart };
  var peg$startRuleFunction = peg$parsestart;
  var peg$c0 = ";";
  var peg$c1 = "var";
  var peg$c2 = "=";
  var peg$c3 = "js!";
  var peg$c4 = "if";
  var peg$c5 = "then";
  var peg$c6 = "end";
  var peg$c7 = "print";
  var peg$c8 = "(";
  var peg$c9 = ")";
  var peg$c10 = "function";
  var peg$c11 = ",";
  var peg$c12 = "True";
  var peg$c13 = "False";
  var peg$c14 = "==";
  var peg$c15 = '"';
  var peg$c16 = '\\\\"';
  var peg$r0 = /^[A-Z_$a-z]/;
  var peg$r1 = /^[A-Z_a-z0-9]/;
  var peg$r2 = /^[^"]/;
  var peg$r3 = /^[+\-]/;
  var peg$r4 = /^[*\/]/;
  var peg$r5 = /^[0-9]/;
  var peg$r6 = /^[ \t\n\r]/;
  var peg$e0 = peg$literalExpectation(";", false);
  var peg$e1 = peg$literalExpectation("var", false);
  var peg$e2 = peg$literalExpectation("=", false);
  var peg$e3 = peg$literalExpectation("js!", false);
  var peg$e4 = peg$literalExpectation("if", false);
  var peg$e5 = peg$literalExpectation("then", false);
  var peg$e6 = peg$literalExpectation("end", false);
  var peg$e7 = peg$literalExpectation("print", false);
  var peg$e8 = peg$literalExpectation("(", false);
  var peg$e9 = peg$literalExpectation(")", false);
  var peg$e10 = peg$literalExpectation("function", false);
  var peg$e11 = peg$literalExpectation(",", false);
  var peg$e12 = peg$literalExpectation("True", false);
  var peg$e13 = peg$literalExpectation("False", false);
  var peg$e14 = peg$classExpectation([["A", "Z"], "_", "$", ["a", "z"]], false, false);
  var peg$e15 = peg$classExpectation([["A", "Z"], "_", ["a", "z"], ["0", "9"]], false, false);
  var peg$e16 = peg$literalExpectation("==", false);
  var peg$e17 = peg$literalExpectation('"', false);
  var peg$e18 = peg$classExpectation(['"'], true, false);
  var peg$e19 = peg$literalExpectation('\\\\"', false);
  var peg$e20 = peg$classExpectation(["+", "-"], false, false);
  var peg$e21 = peg$classExpectation(["*", "/"], false, false);
  var peg$e22 = peg$otherExpectation("integer");
  var peg$e23 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e24 = peg$otherExpectation("whitespace");
  var peg$e25 = peg$classExpectation([" ", "	", "\n", "\r"], false, false);
  var peg$f0 = function(code2) {
    return {
      "type": "Program",
      "body": code2
    };
  };
  var peg$f1 = function(head, tail) {
    return [head].concat(tail.map(function(element) {
      return element[2];
    }));
  };
  var peg$f2 = function(expression) {
    return {
      "type": "ExpressionStatement",
      "expression": expression
    };
  };
  var peg$f3 = function(variable, expression) {
    return {
      "type": "AssignmentStatement",
      "Identifier": variable,
      "Value": expression
    };
  };
  var peg$f4 = function(variable, expression) {
    return {
      "type": "ReassignmentStatement",
      "Identifier": variable,
      "Value": expression
    };
  };
  var peg$f5 = function(expression) {
    return {
      "type": "JavaScriptStatement",
      "code": expression
    };
  };
  var peg$f6 = function(expression, body) {
    return {
      "type": "IfStatement",
      "test": expression,
      "consequent": {
        "type": "BlockStatement",
        "body": body
      },
      "alternate": null
    };
  };
  var peg$f7 = function(expression) {
    return {
      "type": "PrintStatement",
      "value": expression
    };
  };
  var peg$f8 = function(name, params, body) {
    return {
      "type": "FunctionDeclaration",
      "name": name,
      "parameters": params,
      "body": body
    };
  };
  var peg$f9 = function(name, args) {
    return {
      "type": "FunctionCall",
      "name": name,
      "arguments": args
    };
  };
  var peg$f10 = function(head, tail) {
    return [head].concat(tail.map(function(element) {
      return element[2];
    }));
  };
  var peg$f11 = function(head, tail) {
    return [head].concat(tail.map(function(element) {
      return element[2];
    }));
  };
  var peg$f12 = function(expression) {
    return expression;
  };
  var peg$f13 = function(value) {
    return { "type": "Literal", "value": value };
  };
  var peg$f14 = function() {
    return true;
  };
  var peg$f15 = function() {
    return false;
  };
  var peg$f16 = function(variable) {
    return {
      "type": "Identifier",
      "name": variable
    };
  };
  var peg$f17 = function(name) {
    return {
      "type": "Identifier",
      "name": name
    };
  };
  var peg$f18 = function() {
    return text();
  };
  var peg$f19 = function(left, right) {
    return {
      "type": "BinaryExpression",
      "operator": "==",
      "left": left,
      "right": right
    };
  };
  var peg$f20 = function() {
    return JSON.parse(text());
  };
  var peg$f21 = function(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        "type": "BinaryExpression",
        "operator": element[1],
        "left": result,
        "right": element[3]
      };
    }, head);
  };
  var peg$f22 = function(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        "type": "BinaryExpression",
        "operator": element[1],
        "left": result,
        "right": element[3]
      };
    }, head);
  };
  var peg$f23 = function(expr) {
    return expr;
  };
  var peg$f24 = function() {
    return parseInt(text(), 10);
  };
  var peg$f25 = function() {
    return [];
  };
  var peg$currPos = options.peg$currPos | 0;
  var peg$savedPos = peg$currPos;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = peg$currPos;
  var peg$maxFailExpected = options.peg$maxFailExpected || [];
  var peg$silentFails = options.peg$silentFails | 0;
  var peg$result;
  if (options.startRule) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function offset() {
    return peg$savedPos;
  }
  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location2
    );
  }
  function error(message, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location2);
  }
  function peg$literalExpectation(text2, ignoreCase) {
    return { type: "literal", text: text2, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts, inverted, ignoreCase };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;
    if (details) {
      return details;
    } else {
      if (pos >= peg$posDetailsCache.length) {
        p = peg$posDetailsCache.length - 1;
      } else {
        p = pos;
        while (!peg$posDetailsCache[--p]) {
        }
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos, offset2) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);
    var res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
    if (offset2 && peg$source && typeof peg$source.offset === "function") {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }
  function peg$fail(expected2) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected2);
  }
  function peg$buildSimpleError(message, location2) {
    return new peg$SyntaxError(message, null, null, location2);
  }
  function peg$buildStructuredError(expected2, found, location2) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected2, found),
      expected2,
      found,
      location2
    );
  }
  function peg$parsestart() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = peg$parsestatements();
    if (s2 === peg$FAILED) {
      s2 = peg$parse_();
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      peg$savedPos = s0;
      s0 = peg$f0(s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsestatements() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;
    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = peg$parsejs_statement();
    if (s2 === peg$FAILED) {
      s2 = peg$parsereassignment_statement();
      if (s2 === peg$FAILED) {
        s2 = peg$parseassignment_statement();
        if (s2 === peg$FAILED) {
          s2 = peg$parseif_statement();
          if (s2 === peg$FAILED) {
            s2 = peg$parseprint_statement();
            if (s2 === peg$FAILED) {
              s2 = peg$parseexpression_statement();
              if (s2 === peg$FAILED) {
                s2 = peg$parsefunction_declaration();
                if (s2 === peg$FAILED) {
                  s2 = peg$parsefunction_call();
                }
              }
            }
          }
        }
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      s4 = [];
      s5 = peg$currPos;
      s6 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 59) {
        s7 = peg$c0;
        peg$currPos++;
      } else {
        s7 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e0);
        }
      }
      peg$silentFails--;
      if (s7 === peg$FAILED) {
        s6 = void 0;
      } else {
        peg$currPos = s6;
        s6 = peg$FAILED;
      }
      if (s6 !== peg$FAILED) {
        s7 = peg$parse_();
        s8 = peg$parsejs_statement();
        if (s8 === peg$FAILED) {
          s8 = peg$parsereassignment_statement();
          if (s8 === peg$FAILED) {
            s8 = peg$parseassignment_statement();
            if (s8 === peg$FAILED) {
              s8 = peg$parseif_statement();
              if (s8 === peg$FAILED) {
                s8 = peg$parseprint_statement();
                if (s8 === peg$FAILED) {
                  s8 = peg$parseexpression_statement();
                  if (s8 === peg$FAILED) {
                    s8 = peg$parsefunction_declaration();
                    if (s8 === peg$FAILED) {
                      s8 = peg$parsefunction_call();
                    }
                  }
                }
              }
            }
          }
        }
        if (s8 !== peg$FAILED) {
          s6 = [s6, s7, s8];
          s5 = s6;
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
      } else {
        peg$currPos = s5;
        s5 = peg$FAILED;
      }
      while (s5 !== peg$FAILED) {
        s4.push(s5);
        s5 = peg$currPos;
        s6 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 59) {
          s7 = peg$c0;
          peg$currPos++;
        } else {
          s7 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e0);
          }
        }
        peg$silentFails--;
        if (s7 === peg$FAILED) {
          s6 = void 0;
        } else {
          peg$currPos = s6;
          s6 = peg$FAILED;
        }
        if (s6 !== peg$FAILED) {
          s7 = peg$parse_();
          s8 = peg$parsejs_statement();
          if (s8 === peg$FAILED) {
            s8 = peg$parsereassignment_statement();
            if (s8 === peg$FAILED) {
              s8 = peg$parseassignment_statement();
              if (s8 === peg$FAILED) {
                s8 = peg$parseif_statement();
                if (s8 === peg$FAILED) {
                  s8 = peg$parseprint_statement();
                  if (s8 === peg$FAILED) {
                    s8 = peg$parseexpression_statement();
                    if (s8 === peg$FAILED) {
                      s8 = peg$parsefunction_declaration();
                      if (s8 === peg$FAILED) {
                        s8 = peg$parsefunction_call();
                      }
                    }
                  }
                }
              }
            }
          }
          if (s8 !== peg$FAILED) {
            s6 = [s6, s7, s8];
            s5 = s6;
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f1(s2, s4);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseexpression_statement() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseexpression();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 59) {
        s3 = peg$c0;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e0);
        }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f2(s1);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseassignment_statement() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c1) {
      s1 = peg$c1;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e1);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parsename();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 61) {
          s5 = peg$c2;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e2);
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseexpression();
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c0;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e0);
              }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f3(s3, s7);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsereassignment_statement() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = peg$parsename();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 61) {
        s3 = peg$c2;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e2);
        }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseexpression();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 59) {
            s7 = peg$c0;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e0);
            }
          }
          if (s7 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f4(s1, s5);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsejs_statement() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c3) {
      s1 = peg$c3;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e3);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parsestring();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 59) {
          s5 = peg$c0;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e0);
          }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f5(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseif_statement() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c4) {
      s1 = peg$c4;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e4);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parsecomparison();
      if (s3 === peg$FAILED) {
        s3 = peg$parseexpression();
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.substr(peg$currPos, 4) === peg$c5) {
          s5 = peg$c5;
          peg$currPos += 4;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e5);
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parsestatements();
          if (s6 === peg$FAILED) {
            s6 = peg$parse_();
          }
          if (s6 !== peg$FAILED) {
            s7 = peg$parse_();
            if (input.substr(peg$currPos, 3) === peg$c6) {
              s8 = peg$c6;
              peg$currPos += 3;
            } else {
              s8 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e6);
              }
            }
            if (s8 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f6(s3, s6);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseprint_statement() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c7) {
      s1 = peg$c7;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e7);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c8;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e8);
        }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseexpression();
        if (s5 === peg$FAILED) {
          s5 = "";
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c9;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e9);
            }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c0;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e0);
              }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f7(s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsefunction_declaration() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 8) === peg$c10) {
      s1 = peg$c10;
      peg$currPos += 8;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e10);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseidentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 40) {
          s5 = peg$c8;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e8);
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseparameters_list();
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 41) {
              s9 = peg$c9;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e9);
              }
            }
            if (s9 !== peg$FAILED) {
              s10 = peg$parse_();
              s11 = peg$parsestatements();
              if (s11 !== peg$FAILED) {
                s12 = peg$parse_();
                if (input.substr(peg$currPos, 3) === peg$c6) {
                  s13 = peg$c6;
                  peg$currPos += 3;
                } else {
                  s13 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e6);
                  }
                }
                if (s13 !== peg$FAILED) {
                  s14 = peg$parse_();
                  if (input.charCodeAt(peg$currPos) === 59) {
                    s15 = peg$c0;
                    peg$currPos++;
                  } else {
                    s15 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e0);
                    }
                  }
                  if (s15 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f8(s3, s7, s11);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsefunction_call() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;
    s0 = peg$currPos;
    s1 = peg$parseidentifier();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c8;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e8);
        }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parsearguments_list();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c9;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e9);
            }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c0;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e0);
              }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f9(s1, s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseparameters_list() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    s1 = peg$parseidentifier();
    if (s1 === peg$FAILED) {
      s1 = "";
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c11;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e11);
        }
      }
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = void 0;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        s6 = peg$parseidentifier();
        if (s6 !== peg$FAILED) {
          s4 = [s4, s5, s6];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c11;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e11);
          }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          s6 = peg$parseidentifier();
          if (s6 !== peg$FAILED) {
            s4 = [s4, s5, s6];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f10(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsearguments_list() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    s1 = peg$parseexpression();
    if (s1 === peg$FAILED) {
      s1 = "";
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c11;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e11);
        }
      }
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = void 0;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        s6 = peg$parseexpression();
        if (s6 !== peg$FAILED) {
          s4 = [s4, s5, s6];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c11;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e11);
          }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          s6 = peg$parseexpression();
          if (s6 !== peg$FAILED) {
            s4 = [s4, s5, s6];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f11(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseexpression() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parsevariable();
    if (s1 === peg$FAILED) {
      s1 = peg$parseliteral();
      if (s1 === peg$FAILED) {
        s1 = peg$parseboolean();
        if (s1 === peg$FAILED) {
          s1 = peg$parsearithmetic();
        }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f12(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parseliteral() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parsestring();
    if (s1 === peg$FAILED) {
      s1 = peg$parseinteger();
      if (s1 === peg$FAILED) {
        s1 = peg$parseboolean();
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f13(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parseboolean() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c12) {
      s1 = peg$c12;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e12);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f14();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c13) {
        s1 = peg$c13;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e13);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f15();
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsevariable() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    s2 = peg$parsekeywords();
    peg$silentFails--;
    if (s2 === peg$FAILED) {
      s1 = void 0;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsename();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f16(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseidentifier() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    s2 = peg$parsekeywords();
    peg$silentFails--;
    if (s2 === peg$FAILED) {
      s1 = void 0;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsename();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f17(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsekeywords() {
    var s0;
    if (input.substr(peg$currPos, 3) === peg$c1) {
      s0 = peg$c1;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e1);
      }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c4) {
        s0 = peg$c4;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e4);
        }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c5) {
          s0 = peg$c5;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e5);
          }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c6) {
            s0 = peg$c6;
            peg$currPos += 3;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e6);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c7) {
              s0 = peg$c7;
              peg$currPos += 5;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e7);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 8) === peg$c10) {
                s0 = peg$c10;
                peg$currPos += 8;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e10);
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsename() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = input.charAt(peg$currPos);
    if (peg$r0.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e14);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r1.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e15);
        }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r1.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
      }
      peg$savedPos = s0;
      s0 = peg$f18();
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsecomparison() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = peg$parseexpression();
    if (s2 !== peg$FAILED) {
      s3 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c14) {
        s4 = peg$c14;
        peg$currPos += 2;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e16);
        }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parse_();
        s6 = peg$parseexpression();
        if (s6 !== peg$FAILED) {
          s7 = peg$parse_();
          peg$savedPos = s0;
          s0 = peg$f19(s2, s6);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsestring() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c15;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e17);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r2.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e18);
        }
      }
      if (s3 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c16) {
          s3 = peg$c16;
          peg$currPos += 3;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r2.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e18);
          }
        }
        if (s3 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c16) {
            s3 = peg$c16;
            peg$currPos += 3;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e19);
            }
          }
        }
      }
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c15;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e17);
        }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f20();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsearithmetic() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = peg$parseterm();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      s5 = input.charAt(peg$currPos);
      if (peg$r3.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e20);
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseterm();
        if (s7 !== peg$FAILED) {
          s4 = [s4, s5, s6, s7];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        s5 = input.charAt(peg$currPos);
        if (peg$r3.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e20);
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseterm();
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f21(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseterm() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = peg$parsefactor();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      s5 = input.charAt(peg$currPos);
      if (peg$r4.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e21);
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parsefactor();
        if (s7 !== peg$FAILED) {
          s4 = [s4, s5, s6, s7];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        s5 = input.charAt(peg$currPos);
        if (peg$r4.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e21);
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parsefactor();
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f22(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsefactor() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c8;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e8);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parsearithmetic();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c9;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e9);
          }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f23(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseliteral();
    }
    return s0;
  }
  function peg$parseinteger() {
    var s0, s1, s2, s3;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = peg$parse_();
    s2 = [];
    s3 = input.charAt(peg$currPos);
    if (peg$r5.test(s3)) {
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e23);
      }
    }
    if (s3 !== peg$FAILED) {
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r5.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e23);
          }
        }
      }
    } else {
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      peg$savedPos = s0;
      s0 = peg$f24();
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e22);
      }
    }
    return s0;
  }
  function peg$parse_() {
    var s0, s1, s2;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r6.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e25);
      }
    }
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = input.charAt(peg$currPos);
      if (peg$r6.test(s2)) {
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e25);
        }
      }
    }
    peg$savedPos = s0;
    s1 = peg$f25();
    s0 = s1;
    peg$silentFails--;
    s1 = peg$FAILED;
    if (peg$silentFails === 0) {
      peg$fail(peg$e24);
    }
    return s0;
  }
  peg$result = peg$startRuleFunction();
  if (options.peg$library) {
    return (
      /** @type {any} */
      {
        peg$result,
        peg$currPos,
        peg$FAILED,
        peg$maxFailExpected,
        peg$maxFailPos
      }
    );
  }
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

// compiler/compiler.js
function compile(ast) {
  let code2 = ``;
  for (let i = 0; i < ast.body.length; i++) {
    let current = ast.body[i];
    if (current.type == "PrintStatement") {
      if (current.value.type == "Identifier") {
        code2 += `console.log(${current.value.name});`;
      } else {
        code2 += `console.log("${current.value.value}");`;
      }
    } else if (current.type == "AssignmentStatement") {
      if (current.Value.type == "Identifier") {
        code2 += `var ${current.Identifier} = ${current.Value.value ? current.Value.value : current.Value.name};`;
      } else {
        code2 += `var ${current.Identifier} = ${JSON.stringify(current.Value.value ? current.Value.value : current.Value.name)};`;
      }
    } else if (current.type == "ReassignmentStatement") {
      if (current.Value.type == "Identifier") {
        code2 += `${current.Identifier} = ${current.Value.value ? current.Value.value : current.Value.name};`;
      } else {
        code2 += `${current.Identifier} = ${JSON.stringify(current.Value.value ? current.Value.value : current.Value.name)};`;
      }
    } else if (current.type == "FunctionDeclaration") {
      code2 += `function ${current.name.name}() {`;
      const compiled_function_code = compile({
        type: "Program",
        body: current.body
      });
      code2 += compiled_function_code;
      code2 += `}`;
    } else if (current.type == "JavaScriptStatement") {
      code2 += `${current.code} 
`;
    } else if (current.type == "FunctionCall") {
      code2 += `${current.name.name}();`;
    }
  }
  return code2;
}
function evalBytecode(code) {
  eval(code);
}

// functions/setX.js
function setX(object, newX) {
  if (!object || !object.x || !object.y) {
    console.log(object);
    throw new Error("Invalid object passed into setX");
  }
  try {
    object.update(newX, object.y);
  } catch (e) {
    try {
      object.x = newX;
    } catch (error) {
      console.log("Error", error);
    }
  }
}

// functions/setY.js
function setY(object, newY) {
  if (!object || !object.x || !object.y) {
    console.log(object);
    throw new Error("Invalid object passed into setY");
  }
  try {
    object.update(object.x, newY);
  } catch (e) {
    try {
      object.y = newY;
    } catch (error) {
      console.log("Error", error);
    }
  }
}

// functions/setFillColor.js
function setFillColor(object, newColor) {
  if (!object || !object.fillColor) {
    console.log(object);
    throw new Error("Invalid object passed into setFillColor");
  }
  try {
    object.fillColor = newColor;
  } catch (error) {
    console.log("Error", error);
  }
}

// functions/engine/rect.js
function rect(engine, x, y, w, h, fc) {
  if (!(engine instanceof RGE)) {
    throw new Error("Invalid engine ref passed to rect constructor");
  }
  const r = new Rect(x, y, w, h, fc);
  engine.addEntity(r);
  return r;
}

// functions/engine/poly.js
function poly() {
}

// functions/engine/ellipse.js
function ellipse(engine, x, y, r, fc) {
  if (!(engine instanceof RGE)) {
    throw new Error("Invalid engine ref passed to rect constructor");
  }
  const e = new Ellipse(x, y, r, fc);
  engine.addEntity(e);
  return e;
}

// functions/engine/clear.js
function clear(engine) {
  if (!(engine instanceof RGE)) {
    throw new Error("Invalid engine ref passed to clear");
  }
  for (const e of engine.entities) {
    engine.destroyEntity(e);
  }
}

// functions/engine/createEngine.js
function createEngine(canvasId, fps = 60) {
  return new RGE(canvasId, fps);
}

// logger.js
var logger_exports = {};
__export(logger_exports, {
  getLogs: () => getLogs,
  resetLogger: () => resetLogger
});
var originalLog = console.log;
var originalError = console.error;
var originalOnError = console.onerror;
var ConsoleLogger = class {
  constructor() {
    this.logs = [];
  }
};
var CL = new ConsoleLogger();
function getLogs() {
  return CL.logs;
}
var isReset = false;
function resetLogger() {
  console.log = originalLog;
  console.error = originalError;
  console.onerror = originalOnError;
}
var isLogging = false;
console.log = function(...args) {
  const optOut = args.some((arg) => arg && arg.optOut === true);
  if (optOut) {
    originalLog.apply(console, args);
    return;
  }
  if (!isLogging) {
    isLogging = true;
    CL.logs.push({
      type: "log",
      message: args
    });
    originalLog.apply(console, args);
    isLogging = false;
  } else {
    originalLog.apply(console, args);
  }
};
console.error = function(...args) {
  CL.logs.push({
    type: "thrown_error",
    message: args
  });
  originalError.apply(console, args);
};
window.onerror = function(message, source, lineno, colno, error) {
  if (!isReset) {
    CL.logs.push(
      {
        type: "window_error",
        message: { message, source, lineno, colno, error }
      }
    );
    originalError("Uncaught error:", message, "at", source, "line", lineno, "column", colno, "error object:", error);
  }
};
export {
  Camera,
  CameraManager,
  Ellipse,
  RGE as Engine,
  Entity,
  EntityManager,
  Group,
  PolyBased_exports as PolyBased,
  Polygon,
  Rect,
  Scene,
  SceneManager,
  Sound,
  StateManager,
  Text,
  TextureManager,
  Widgets_exports as Widgets,
  clear,
  compiler_exports as compiler,
  createEngine,
  ellipse,
  logger_exports as logger,
  poly,
  rect,
  setFillColor,
  setX,
  setY
};
