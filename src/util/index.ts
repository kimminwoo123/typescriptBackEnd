import { Response, Request, NextFunction } from "express"

export const wrap = (asyncFn: Function) => {
    return (async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await asyncFn(req, res, next)
        } catch (error) {
            return next(error)
        }
    })
}