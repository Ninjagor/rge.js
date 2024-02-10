export function update(itemName, newVal) {
    try {
        const removed = localStorage.removeItem(itemName);
        //console.log("i removed it.", removed)
        const newItem = localStorage.setItem(itemName, JSON.stringify(newVal));
        //console.log(`NEW: ${newItem}`)
        return newItem;
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}