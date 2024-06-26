import type { T } from 'vitest/dist/reporters-yx5ZTtEV.js';
import type { App } from 'vue';
class IDB {
    private DB!: IDBDatabase
    // private request!: IDBOpenDBRequest
    constructor() {

    }
    // 打开数据库
    openDB(DBName: string) {

        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(DBName);
            request.onerror = (event: any) => {
                reject({ success: false, event, msg: '数据库打开失败' })
            };
            request.onsuccess = (event: any) => {
                this.DB = request.result;
                resolve({ success: true, event, msg: '数据库打开成功' })

            };
            request.onupgradeneeded = (event: any) => {
                this.DB = event.target.result;
                if (!this.DB.objectStoreNames.contains('bills')) {
                    this.initDB()
                }
                resolve({ success: true, event, msg: '成功onupgradeneeded' })
            }
        })

    }
    // 初始化 账单表
    initDB() {
        const objectStore = this.DB.createObjectStore('bills', { keyPath: 'billsId', autoIncrement: true });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('category', 'category', { unique: false });
    }
    // 读取
    read() {
        return new Promise((resolve, reject) => {

            const transaction = this.DB.transaction(['person']);
            const objectStore = transaction.objectStore('person');
            const request = objectStore.get(1);

            request.onerror = function (event) {
                reject('事务失败');
            };

            request.onsuccess = function (event) {
                resolve(request.result)

            };
        })

    }
    add(billingData: any) {
        return new Promise((resolve, reject) => {
            const addRequest = this.DB.transaction('bills', 'readwrite')
                .objectStore('bills')
                .add(billingData);

            addRequest.onsuccess = function (event) {
                resolve({ success: true, event, msg: '写入成功' })
            };

            addRequest.onerror = function (event) {
                reject({ success: false, event, msg: '写入成功' });
            }
        })


    }
    readAll() {

        return new Promise((resolve, reject) => {


            const objectStore = this.DB.transaction('person').objectStore('person');

            objectStore.openCursor().onsuccess = function (event: any) {

                resolve(event.target.result)

            };
        })

    }
    update() {
        return new Promise((resolve, reject) => {
            const request = this.DB.transaction(['person'], 'readwrite')
                .objectStore('person')
                .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' });

            request.onsuccess = function (event) {
                resolve('数据更新成功');
            };

            request.onerror = function (event) {
                reject('数据更新失败');
            }
        })

    }
    remove() {
        return new Promise((resolve, reject) => {
            const request = this.DB.transaction(['person'], 'readwrite')
                .objectStore('person')
                .delete(1);

            request.onsuccess = function (event) {
                resolve('数据删除成功');
            };
        })

    }
    getByIndex(key: string, val: string) {
        return new Promise((resolve, reject) => {
            const transaction = this.DB.transaction('bills', 'readonly');
            const store = transaction.objectStore('bills');
            const index = store.index(key);
            const request = index.get(val);

            request.onsuccess = function (e: any) {
                const result = e.target.result;
                console.log(result);
                resolve(result)
                // if (result) {

                // } else {
                //     // ...
                // }
            }
        })

    }
    openCursor(indexName: string, val: string | number, range: {
        start: string | number,
        end: string | number
    }) {
        return new Promise((resolve, reject) => {
            const transaction = this.DB.transaction('bills');
            const objectStore = transaction.objectStore('bills');
            const result: Array<T> = []
            let cursorRequest: IDBRequest | null = null
            if (indexName) {
                const index = objectStore.index(indexName)


                if (val) {
                    const value = IDBKeyRange.only(val)
                    cursorRequest = index.openCursor(value, 'next');
                }
                if (range) {
                    const bound = IDBKeyRange.bound(range.start, range.end)
                    cursorRequest = index.openCursor(bound, 'next');
                }


            } else {
                cursorRequest = objectStore.openCursor(null, 'next');
            }

            if (cursorRequest) {
                cursorRequest.onsuccess = function (event: any) {
                    const cursor = event.target.result;
                    if (!cursor) {
                        resolve(result)
                        return
                    }
                    result.push(cursor.value)
                    cursor.continue()

                };
            }


        })

    }
}

const idbPlugin = {
    install(app: App<Element>) {
        const idbWrapper = new IDB();
        idbWrapper.openDB('myDB')
        app.provide('idbWrapper', idbWrapper);
    },
};

export default idbPlugin;

