const {v4: uuidv4} = require('uuid');

// Session ids will be keys, and values will be an object of name/value pairs
//Key: session id Value: name/value pair
const sessionStore = {};
// manageSession and parseCookies

function parseCookies(req, res, next) {

    let cookieHeader = req.get('cookie')
    req.hwCookies = {};
    if (cookieHeader !== undefined) {
        let splittedHeaders = cookieHeader.split(';');
        splittedHeaders.forEach(function(cookie){ 
            const nameValuePair = cookie.split('=');
            req.hwCookies[nameValuePair[0]] = nameValuePair[1];
        });
    }
    next();
}


function manageSession(req, res, next) {


    //req should have a property called hwSession where data received from the
    //session store is placed
    req.hwSession = {};
    let sessionId = req.hwCookies.sessionId;

    //Check if sessionId is in req.hwCookies and check if that session id exists within 
    //session store
    if (sessionId !== undefined && sessionStore.hasOwnProperty(sessionId)){
		req.hwSession = sessionStore[sessionId];
        req.hwSession.sessionId = sessionId;
		console.log("session already exists: ", req.hwSession.sessionId);
	}
	else{
        sessionId = uuidv4();
        //Generated a new session id and created an empty object for that ids data 
        //from the session store
        sessionStore[sessionId] = {};
		res.append("Set-Cookie", "sessionId=" + sessionId + "; HttpOnly");
		console.log("session generated:", sessionId);
	}

    req.hwSession.sessionId = sessionId;
    next();
}
module.exports = {
    parseCookies: parseCookies,
    manageSession: manageSession
};