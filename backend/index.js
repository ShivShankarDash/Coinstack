const express = require("express");
const rootRouter = require("./routes/index")
const app = express()
const cors = require('cors')
const port = 3000
app.use(cors())
app.use(express.json())
app.use("/api/v1", rootRouter)



app.listen(port, (req,res)=>{
   console.log(`App listening on port ${port}`)
})