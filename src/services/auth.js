import crypto from "crypto";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

export const createSession = async (userId) => {
    const accessToken = crypto.randomBytes(30).toString('base64');
    const refreshToken = crypto.randomBytes(30).toString('base64');

    return Session.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};

export const setSessionCookies = (res, sessions) => {
    res.cookie('accessToken', sessions.accessToken, {
        httpOnly: true,
        sequre: true,
        sameSite: 'none', 
        maxAge: FIFTEEN_MINUTES,
    });
    res.cockie('refreshToken', sessions.refreshToken, {
        httpOnly: true,
        sequre: true,
        sameSite: 'none', 
        maxAge: ONE_DAY,
    });
    res.cockie('sessionId', sessions._id, {
        httpOnly: true,
        sequre: true,
        sameSite: 'none', 
        maxAge: ONE_DAY,
    });
};