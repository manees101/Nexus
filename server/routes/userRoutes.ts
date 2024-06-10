import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";
const stream = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_PRIVATE_KEY!
);
const TOKEN_USER_ID_MAP = new Map<string, string>();
export const userRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: { id: string; name: string; image: string } }>(
    "/signup",
    async (req, res) => {
      const { name, id, image } = req.body;
      if (name == null || name == "" || id == null || id == "") {
        return res.status(400).send();
      }
      const existingUsers = await stream.queryUsers({ id });
      if (existingUsers.users.length > 0) {
        return res.status(400).send("User ID taken");
      }
      await stream.upsertUser({ id, name, image });
    }
  );
  app.post<{ Body: { id: string } }>("/login", async (req, res) => {
    const { id } = req.body;
    const {
      users: [user],
    } = await stream.queryUsers({ id });
    if (!user) {
      res.status(401).send();
    }
    const token = stream.createToken(id);
    TOKEN_USER_ID_MAP.set(token, id);
    res.status(200).send({
      token,
      user,
    });
  });
  app.post<{ Body: { token: string } }>("/logout", async (req, res) => {
    const { token } = req.body;
    if (token == null || token === "") {
      return res.status(400).send();
    }

    const id = TOKEN_USER_ID_MAP.get(token);

    if (id == null) return res.status(400).send();

    await stream.revokeUserToken(id, new Date());
    TOKEN_USER_ID_MAP.delete(token);
    res.status(200).send();
  });
};
