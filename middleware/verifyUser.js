const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
    try {
        let token = req.header("authorization");
        let tokenArray = token.split(" ");
        const finalToken = tokenArray[1];
        const data = jwt.verify(finalToken, process.env.JWT_SECRET);
        req.user = data.user;
        req.token = finalToken;
        next();
    } catch (error) {
        res.status(401).send({ error: "invaild token : please try to login"})
    }
}

module.exports = fetchUser