const {validateToken} = require('../service/authentication');

function checkforAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies?.[cookieName];
        const authHeader = req.headers?.authorization || '';
        const bearerToken = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7).trim()
            : null;

        const tokenValue = bearerToken || tokenCookieValue;
        if(!tokenValue){
            return next();
        }

        try{
            const userPayload = validateToken(tokenValue);
            req.user = userPayload;
        } catch (error) {
            req.user = null;
        }
        return next();
    }
}

module.exports = {
    checkforAuthenticationCookie,
}