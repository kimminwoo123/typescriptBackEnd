import app from "./app"
import db from "../db/pg"

db.connect() // db연결
    .then(() => {
        console.log('db 연결 성공')
    })
    .catch(console.error)

app.listen(3000, () => {
    console.info(`Server is running on port:3000`)
})

export default app