import express from "express";

export const cookies = {
    getOptions: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    }),

    set: (res : any, name : string, value : any, options = {}) => {
        res.cookie(name, value, { ...cookies.getOptions(), ...options });
    },

    clear: (res : any, name : string, options = {}) => {
        res.clearCookie(name, { ...cookies.getOptions(), ...options });
    },

    get: (req: any, name : string) => {
        return req.cookies[name];
    },
};