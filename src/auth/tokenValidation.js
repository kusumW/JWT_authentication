const { verify } = require('jsonwebtoken');
require('dotenv').config();
module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            token = token.slice(7);
            verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    res.json({
                        sucess: 0,
                        message: 'invalid token'

                    });
                } else {
                    next();
                }
            })
        } else {
            res.json({
                sucess: 0,
                message: 'Acess denied! Unauthorized user'

            });
        }
    }
}
