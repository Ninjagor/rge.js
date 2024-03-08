export function addKeyPressAction(actions) {
    // Track the state of each key
    const keyStates = {};

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

    const handleKeyHold = (key) => {
        if (keyStates[key] && actions[key] && actions[key].hold) {
            actions[key].hold();
        }
    };

    // Dynamically add event listeners for key press, key release, and key hold
    for (const key in actions) {
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', handleKeyUp);
        setInterval(() => handleKeyHold(key), 100);
    }
}
