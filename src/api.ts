import { Router, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Email } from "./entity/Email";
import { IsNull, Not, } from "typeorm";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import { User } from "./entity/User";
import * as jwt from "jsonwebtoken";

export const apiRouter = Router({});

apiRouter.use(
  "*",
  expressjwt({
    secret: "shhhhhhared-secret",
    algorithms: ["HS256"],
    credentialsRequired: false,
    getToken: (req) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      } else if (req.query && req.query.token) {
        return req.query.token.toString();
      }
      return "";
    },
  }).unless({ path: ["/login"] }),
  (req: JWTRequest, res, next) => {
    if (
      req.auth != null ||
      req.baseUrl === "/api/login" ||
      req.baseUrl === "/api/register"
    ) {
      next();
    } else {
      res.send({ error: "Not authentified" });
    }
  }
);
apiRouter.post("/login", async (req: Request, res: Response) => {
  const body = req.body;
  const user = await AppDataSource.manager.findOne(User, {
    where: {
      address: body.email,
    },
  });
  if (user) {
    const token = jwt.sign(user.address, "shhhhhhared-secret", {
      algorithm: "HS256",
    });
    res.json({ token, error: null, user });
  } else {
    res.json({ token: null, error: "User not found" });
  }
});

apiRouter.post("/register", async (req: Request, res: Response) => {
  const body = req.body;

  const user = await AppDataSource.manager.findOne(User, {
    where: {
      address: body.email,
    },
  });
  if (!user) {
    const user = new User();
    user.name = body.name;
    user.address = body.email;
    const userS = await AppDataSource.manager.save(user);
    if (userS) {
      const token = jwt.sign(user.address, "shhhhhhared-secret", {
        algorithm: "HS256",
      });
      res.json({ token, error: null, user: userS });
    } else {
      res.json({ token: null, error: "User not registered" });
    }
  } else {
    res.json({ token: null, error: "E-mail already exist" });
  }
});

apiRouter.get("/email", async (req: JWTRequest, res) => {
  const currentUser = req.auth as unknown as string;
  const emails = await AppDataSource.manager.find(Email, {
    withDeleted: false,
    relations: {
      from: true,
      to: true,
      attachments: true,
      read: true
    },
    order: {
      created_at: "DESC",
    },
    where: {
      to: {
        address: currentUser,
      },
    },
  });
  res.json({ data: emails });
});

apiRouter.get("/email/sent", async (req: JWTRequest, res) => {
  const currentUser = req.auth as unknown as string;
  const emails = await AppDataSource.manager.find(Email, {
    withDeleted: false,
    relations: {
      from: true,
      to: true,
      attachments: true,
      read: true
    },
    order: {
      created_at: "DESC",
    },
    where: {
      from: {
        address: currentUser,
      },
    },
  });
  res.json({ data: emails });
});

apiRouter.get("/email/deleted", async (req: JWTRequest, res) => {
  const currentUser = req.auth as unknown as string;
  const emails = await AppDataSource.manager.find(Email, {
    withDeleted: true,
    relations: {
      from: true,
      to: true,
      attachments: true,
      read: true
    },
    order: {
      created_at: "DESC",
    },
    where: [
      {
        from: {
          address: currentUser,
        },
        deleted_at: Not(IsNull()),
      },
      {
        to: {
          address: currentUser,
        },
        deleted_at: Not(IsNull()),
      },
    ],
  });
  res.json({ data: emails });
});

apiRouter.get("/read/:id", async (req: JWTRequest, res) => {
  const currentUser = req.auth as unknown as string;
  const id = req.params.id;
  const email = await AppDataSource.manager.findOne(Email, {
    withDeleted: true,
    where: {
      id: parseInt(id),
    },
    relations: {
      read: true
    }
  });
  if (email) {
    const user = await AppDataSource.manager.findOne(User, {
      where: {
        address: currentUser,
      },
    });
    const ru = email.read.map((e)=>e.address)
    if(user && !ru.includes(user.address)){
      email.read.push(user);
      await AppDataSource.manager.save(Email, email);
    }
    res.json({ success: true, error: null });
  } else {
    res.json({ success: null, error: "Email not found" });
  }
});

apiRouter.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const updateRep = await AppDataSource.manager.softDelete(Email, {
    id: parseInt(id),
  });
  if (updateRep.affected) {
    res.json({ success: true, error: null });
  } else {
    res.json({ success: null, error: "Email not found" });
  }
});
