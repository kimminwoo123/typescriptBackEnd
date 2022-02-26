import "reflect-metadata"
import { createConnection } from "typeorm"
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export default createConnection({
    type: 'postgres',
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: [
        __dirname + "/../src/entities/*.ts"
    ],
    synchronize: true,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
}).then(connection => {
    console.log('typeorm connection')
}).catch(error => console.log(error))