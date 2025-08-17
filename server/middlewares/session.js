// /middleware/session.js
import crypto from "crypto";

export const sessionMiddleware = (req, res, next) => {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.cookie("sessionId", sessionId, {
      httpOnly: true,   // tidak bisa diakses lewat JS
      secure: true,    // true kalau pakai HTTPS
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    });
  }

  req.sessionId = sessionId;
  next();
};
