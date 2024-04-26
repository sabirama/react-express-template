const appAuth = (req: any, res: any, next: any) => {
    if (req.headers.app_key !== process.env.APP_KEY) {
        return res.status(403).send({ error: "Unauthorized access.", message: "You are not authorized or you don't have access." })
    }

    next()
}

export default appAuth;