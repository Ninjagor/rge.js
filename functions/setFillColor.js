export function setFillColor(object, newColor) {
	if (!(object) || !(object.fillColor)) {
		console.log(object)
		throw new Error("Invalid object passed into setFillColor")
	}
	try {
		object.fillColor = newColor;
	} catch (error) {
		console.log("Error", error)
	}
}
