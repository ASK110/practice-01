const path = require("path")
//   Paths
const staticPath = path.join(__dirname,"../static")
const viewPath = path.join(__dirname,"../templates")
const partialsPath = path.join(viewPath,"/partials")

module.exports = {staticPath,viewPath,partialsPath}