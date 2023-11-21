class LocalStorageManager {
    static prefix = "__";

    constructor() {}

    static storeData(name, data) {
        localStorage.setItem(
            LocalStorageManager.prefix + name,
            JSON.stringify(data)
        );
    }

    static getData(name) {
        return JSON.parse(
            localStorage.getItem(LocalStorageManager.prefix + name)
        );
    }

    static clearData(name) {
        localStorage.removeItem(LocalStorageManager.prefix + name);
    }
}
