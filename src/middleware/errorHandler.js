export const errorHandler = (err, req, res, next) => {
    console.log(err);

    const isProd = process.env.NODE_ENV === "production";

    res.status(500).json({
        message: isProd
            ? "Something went wrong. Please try it again"
            : err.message
    });
};