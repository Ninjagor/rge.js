export function setY(object, newY) {
	if (!(object) || !(object.x) || !(object.y)) {
		console.log(object)
		throw new Error("Invalid object passed into setY")
	}
	try {
		// use update method (contained in all entitities)
		object.update(object.x, newY);
	} catch (e) {
		// try directly setting x
		try {
			object.y = newY
		} catch (error) {
			console.log("Error", error)
		}
	}
}
