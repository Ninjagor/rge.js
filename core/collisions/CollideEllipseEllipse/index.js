export function collideEllipseEllipse(ellipse1, ellipse2) {
    const distance = Math.sqrt((ellipse1.x - ellipse2.x) ** 2 + (ellipse1.y - ellipse2.y) ** 2);
    return distance <= ellipse1.radius + ellipse2.radius;
}