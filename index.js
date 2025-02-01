import express from 'express';
import 'dotenv/config';

import rateLimiter from './middlewares/localRateLimiter';
import redisHandlerInstance from './redisHandler';

const app = express();

app.use(rateLimiter(10,100,'globalLimit'));



app.get("/", (req, res) => {
    return res.send(`Access the following API routes: <ul> 
            <li>
                <a href='/api-one'>API 1</a> 
            </li>
            <li>
                <a href='/api-two'>API 2</a> 
            </li>
            <li>
                <a href='/api-three'>API 3</a> 
            </li>
            <li>
                <a href='/api-four'>API 4</a> 
            </li>
        </ul>`);
});

app.get("/api-one", rateLimiter(10, 5, "API 1"), async (req, res) => {

    return res.json({
        status: "Success",
        apiMessage: "API 1",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

app.get("/api-two", rateLimiter(4, 1, "API 2"), async (req, res) => {

    return res.json({
        status: "Success",
        apiMessage: "API 2",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

app.get("/api-three", rateLimiter(5, 3, "API 3"), async (req, res) => {
    
    return res.json({
        status: "Success",
        apiMessage: "API 3",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

app.get("/api-four", rateLimiter(20, 10, "API 4"), async (req, res) => {
    
    return res.json({
        status: "Success",
        apiMessage: "API 4",
        callsMadeInAWindow: req.numRequests,
        timeLeft: req.timeLeft,
    });
});

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT,async()=>{
    await redisHandlerInstance.init();
    console.log(`Server is up and running on port: ${PORT}`);
})