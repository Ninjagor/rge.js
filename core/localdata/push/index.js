export function push(itemName, itemVal) {
    try {
        const item = localStorage.setItem(itemName, JSON.stringify(itemVal));
        return item;
    } catch(error) {
        console.error(error);
        throw new Error(error);
    }
}