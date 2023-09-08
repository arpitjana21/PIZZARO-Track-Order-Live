const register = function (req, res) {
    console.log(req.body);
    res.status(200).json({
        status: 'success',
    });
};

module.exports = {register};
