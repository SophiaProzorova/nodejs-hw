import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        next(createHttpError(401, 'Invalid credentials'));
        return;
    }

    const isValidPassword = bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
        next(createHttpError(401, 'Invalid credentials'));
        return;
    }

    await Session.deleteOne({ userId: user._id });

    const newSession = await createSession(user._id);

    setSessionCookies(res, newSession);

    res.staus(200).json(user);
};

export const registerUser = async (req, res, next) => {
    const { email, password } = req.body;
    
    const isUserExisted = await User.findOne({ email });

    if (isUserExisted) {
        next(createHttpError(400, 'Email in use'));
        return;
    }

    const hashedPassword = bcrypt(password, 10);

    const newUser = await User.create({
        email,
        password: hashedPassword,
    });

    const newSession = await createSession(newUser._id);

    setSessionCookies(res, newSession);

    res.status(200).json(newUser);
};

export const refreshUserSession = async ( req, res, next) => {
    const { sessionId, refreshToken } = req.cookies;

    const session = await Session.findOne({_id: sessionId, refreshToken});

    if (!session) {
        next(createHttpError(401, 'Session not found'));
        return;
    }

    const isRefreshTokenExpired = new Date.now() > new Date(refreshToken);

    if (isRefreshTokenExpired) {
        next(createHttpError(401, 'Session token expired'));
        return;
    }

    await Session.deleteOne({_id: sessionId});
    
    const newSession = createSession(sessionId);

    setSessionCookies(res, newSession);

    return res.status(200).json({"message": "Session refreshed"});
};

export const logoutUser = async (req, res, next) => {
    const { sessionId } = req.cookies;
    
    if (sessionId) {
        await Session.deleteOne({_id: sessionId});
    }

    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(204);
};