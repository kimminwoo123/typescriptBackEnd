import "reflect-metadata"
import app from "./app"
import connection from '../config/typeorm'

connection
    .then(connection => { })
    .catch(e => console.log(e))

app.listen(3000, () => {
    console.info(`Server is running on port:3000`)
})

export default app