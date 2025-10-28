import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/note.js";

export const authenticate = async (req, res, next) => {
   if (!req.cookie.accessToken) {
    next(createHttpError(401, 'Missing access token'));
   }

   const session = await Session.findOne({accessToken: req.cookie.accessToken});

   if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
   }

   const isAccessTokenExpired = new Date.now() > new Date(req.cookie.accessToken);

   if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
   }

   const user = await User.findById(session.userId);

   if (!user){
    next(createHttpError(401));
    return;
   }

   req.user = user;
   next();
};