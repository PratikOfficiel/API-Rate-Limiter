import Redis from 'ioredis';

class RedisHandler {

    #redisClient;

    constructor() {

        if(!RedisHandler.singleInstance){
            RedisHandler.singleInstance = this;
        }

        return RedisHandler.singleInstance;
    }

    init = ()=>{

        if(this.#redisClient){
            return;
        }

        this.#redisClient = new Redis();

    }

    getRedisClient() {

        if(this.#redisClient){
            return this.#redisClient;
        }

        this.#redisClient = new Redis();
        return this.#redisClient;
    }
}

const redisHandlerInstance = new RedisHandler();
export default redisHandlerInstance;