import * as express from "express"

declare global {
    namespace Express {
        interface Request {
            instructor_id?: Record<string, any>
            id?: Record<string, any>
            lecture_name?: Record<string, any>
            lecture_id?: Record<string, any>
            category?: Record<string, any>
            lecture_introduction?: Record<string, any>
            lecture_price?: Record<string, any>
        }
    }
}