const logRequest = (req, res, next) => {
    console.log('Requesting to PATH: ', req.path)
    next()
}

module.exports = logRequest