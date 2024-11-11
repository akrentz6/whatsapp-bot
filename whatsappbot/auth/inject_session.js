function requestPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function openDatabase(dbName) {
    const request = indexedDB.open(dbName);
    return requestPromise(request);
}

function clearDatabase(db, storeName) {
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const clearRequest = objectStore.clear();
    return requestPromise(clearRequest);
}

async function putInStore(db, storeName, data) {
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);
    for (const item of data) {
        const request = objectStore.put(item);
        await requestPromise(request);
    }
}

function putInLocalStorage(data) {
    localStorage.clear()
    for (const item of data) {
        localStorage.setItem(item.key, item.value);
    }
}

try {
    const session = JSON.parse(arguments[2]);
    const db = await openDatabase(arguments[0]);
    await clearDatabase(db, arguments[1]);
    await putInStore(db, arguments[1], session);
    putInLocalStorage(session);
} catch (error) {
    console.error("Failed to inject session:", error);
}