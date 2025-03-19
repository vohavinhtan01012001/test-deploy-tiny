function isJSONString(str) {
    if(typeof str !== "string") return false;
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

export function setStorageItem(key, data) {
    try {
        if(!key) throw new Error("Key is not found");

        if(typeof data !== "string") {
            data = JSON.stringify(data);
        }

        localStorage.setItem(key, data);

        window.electronStorage.setItem(key, data);
    } catch(error) {
        // console.log("Error: ", error);
    }
}

export function removeStorageItem(key) {
    try {
        if(!key) throw new Error("Key is not found");

        localStorage.removeItem(key);

        window.electronStorage.removeItem(key);
    } catch(error) {
        // console.log("Error: ", error);
    }
}

export async function getStorageItem(key, defaultValue = "") {
    return new Promise(async (resolve) => {
        let result = defaultValue;
        let localStorageResult;
        try {
            if(!key) throw new Error("Key is not found");

            localStorageResult = localStorage.getItem(key);

            result = await window.electronStorage.getItem(key);

        } catch(error) {
            // console.log("Error: ", error);
        } finally {
            result = result || localStorageResult;
            if(isJSONString(result)) {
                result = JSON.parse(result);
            }
            resolve(result);
        }
    });
}