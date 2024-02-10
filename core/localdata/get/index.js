export function get(itemId) {
    try {
        const item = localStorage.getItem(itemId);
        return JSON.parse(item);
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}