import "reflect-metadata"
import app from "./app"
import db from "../db/pg"
import connection from '../config/typeorm'

// db.connect() // db연결
//     .then(() => {
//         console.log('db 연결 성공')
//     })
//     .catch(console.error)

connection
    .then(connection => { })
    .catch(e => console.log(e))

app.listen(3000, () => {
    console.info(`Server is running on port:3000`)
})

export default app