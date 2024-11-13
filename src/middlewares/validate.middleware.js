export const validateSchema = (Schema) => async (req, res, next) => {
    try {
        await Schema.parse(req.body)
        next()
    } catch (error) {

        if (Array.isArray(error.errors)) {
            return res.status(400).json(error.errors.map((error) => error.message))
        }


        return res.status(400).json(error.message)
    }
}