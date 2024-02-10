export function remove(itemName) {
    try {
        const item = localStorage.removeItem(itemName);
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}