module.exports =
(req, res, next) => {

    const start = Date.now();

    res.on("finish", () => {

        console.log({

            method: req.method,

            url: req.originalUrl,

            status:
                res.statusCode,

            latency:
                Date.now() - start
        });

    });

    next();
};