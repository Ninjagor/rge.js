export function setX(object, newX) {
	if (!(object) || !(object.x) || !(object.y)) {
		console.log(object)
		throw new Error("Invalid object passed into setX")
	}
	try {
		// use update method (contained in all entitities)
		object.update(newX, object.y);
	} catch (e) {
		// try directly setting x
		try {
			object.x = newX
		} catch (error) {
			console.log("Error", error)
		}
	}
}
