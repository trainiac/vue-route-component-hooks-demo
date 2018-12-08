module.exports = renderer => (req, res, next) => {
  renderer.renderToString({}, (err, html) => {
    if (err) {
      if (err.redirectUrl) {
        res.redirect(err.redirectUrl)
      } else if (err.notFound) {
        res.status(404).send('Not Found')
      } else {
        next(err)
      }
    }
    res.send(html)
  })
}
