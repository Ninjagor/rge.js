// export function addKeyPressAction(actions) {
//     // Track the state of each key
//     const keyStates = {};

//     const handleKeyPress = (event) => {
//         const key = event.key;
//         if (!keyStates[key] && actions[key] && actions[key].press) {
//             keyStates[key] = true;
//             actions[key].press();
//         }
//     };

//     const handleKeyUp = (event) => {
//         const key = event.key;
//         keyStates[key] = false;
//         if (actions[key] && actions[key].release) {
//             actions[key].release();
//         }
//     };

    // const handleKeyHold = (key) => {
    //     if (keyStates[key] && actions[key] && actions[key].hold) {
    //         actions[key].hold();
    //     }
    // };

//     // Dynamically add event listeners for key press, key release, and key hold
//     for (const key in actions) {
//         document.addEventListener('keydown', handleKeyPress);
//         document.addEventListener('keyup', handleKeyUp);
//         setInterval(() => handleKeyHold(key), 100);
//     }

//     this.keyStates = keyStates;
// }

export function addKeyPressAction(actions) {
    // Track the state of each key
    // const keyStates = {};

    const keyStates = this.keyStates;

    const handleKeyPress = (event) => {
        const key = event.key;
        // console.log(this.keyStates)
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

    // Dynamically add event listeners for key press and key release
    for (const key in actions) {
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', handleKeyUp);
        setInterval(() => handleKeyHold(this, actions, key), 100)
    }
}

export function handleKeyPress(event) {
    const key = event.key;
    if (!this.pressedKeys[key] && this.keyPressActions[key]) {
        this.pressedKeys[key] = true;
        this.keyPressActions[key]();
    }
}

export function handleKeyUp(event) {
    const key = event.key;
    this.pressedKeys[key] = false;
}

export function handleKeyHold (thisref, actions, key) {
    if (thisref.keyStates[key] && actions[key] && actions[key].hold) {
        actions[key].hold();
    }
};