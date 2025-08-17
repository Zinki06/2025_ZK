export function convertObjToMap(obj) {
    const map = new Map();
    Object.entries(obj).map(([key, value]) => {
        let pushedValue = value;
        if (typeof pushedValue === "object")
            pushedValue = convertObjToMap(value);
        map.set(key, pushedValue);
    });
    return map;
}
