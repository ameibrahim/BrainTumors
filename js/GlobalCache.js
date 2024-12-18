class GlobalCache {

    constructor(){
        this.cache = { };
    }

    get(cacheObjectKeyName){
        return this.cache[cacheObjectKeyName];
    } 
    
    put(cacheObjectKeyName, data){
        this.cache[cacheObjectKeyName] = data;
    }
}

const globalCache = new GlobalCache();