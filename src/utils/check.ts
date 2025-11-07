export function shallowEqual(obj1: any, obj2: any): boolean {
    console.log("1", obj1);
    
    console.log("2", obj2);
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}