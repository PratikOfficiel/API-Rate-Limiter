import redisHandlerInstance from "../redisHandler.js";

function rateLimiter(secondsWindow, allowedAPIHits, apiMessage) {

    return async function (req,res,next) {

        const redisClient = redisHandlerInstance.getRedisClient();

        let ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if(ipAddress.substr(0,7)=="::ffff:"){
            ipAddress = ipAddress.substr(7);
        }

        const key = ipAddress+apiMessage;

        const numRequests = await redisClient.incr(key);
        let ttl = secondsWindow;

        if(numRequests===1){
            await redisClient.expire(key,secondsWindow);
        }
        else{
            ttl = await redisClient.ttl(key);
        }

        if(numRequests>allowedAPIHits) {
            return res.status(504).json({
                status: "failure",
                apiMessage,
                callsMadeInAWindow : numRequests,
                ttl
            })
        }


        req.numRequests= numRequests;
        req.timeLeft = ttl;
        next();
    }
}

export default rateLimiter;