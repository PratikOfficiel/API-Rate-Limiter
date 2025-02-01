function globalRateLimiter(req,res,next) {
    req.globalMsg = 'hello from global Rate Limiter';
    next();
}

export default globalRateLimiter;