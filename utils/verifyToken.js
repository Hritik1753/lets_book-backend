import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";


// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     return next(createError(401, "You are not authenticated!"));
//   }

//   jwt.verify(token, process.env.JWT, (err, user) => {
//     if (err) return next(createError(403, "Token is not valid!"));
//     req.user = user;
//     next();
//   });
// };

export const verifyToken = (req, res, next, callback) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    if (callback) {
      callback();
    } else {
      next();
    }
  });
};


export const verifyUser = (req, res, next) => {
  console.log("mujhe bulaya kya");
  verifyToken(req, res, next, () => {
    console.log("dekho me aa gya");
    console.log("verifyAdmin middleware called");
    console.log("req.user:", req.user);

    if ( req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  
  verifyToken(req, res, next, () => {
    console.log("dekho me aa gya");
    console.log("verifyAdmin middleware called");
    console.log("req.user:", req.user);

    if (req.user.isAdmin == true) {
      next();
    } else {

      console.log("dekho me aa gya aur andar aa jao");
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// export const verifyAdmin = (req, res, next) => {
//   console.log("verifyAdmin middleware called");
//   console.log("req.user:", req.user);

//   if (req.user.isAdmin === true) {
//     console.log("User is an admin");
//     next();
//   } else {
//     console.log("User is not an admin");
//     return next(createError(403, "You are not authorized!"));
//   }
// };
