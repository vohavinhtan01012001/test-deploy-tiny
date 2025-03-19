export function isJSONString(str) {
    if(typeof str !== "string") return false;
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

export const tryParseJson = (data) => {
    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
}