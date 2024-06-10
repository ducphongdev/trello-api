import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

let trelloDatabaseInstant = null;

const mongoClientInstant = new MongoClient(env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClientInstant.connect();

  trelloDatabaseInstant = mongoClientInstant.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
  if (!trelloDatabaseInstant)
    throw new Error("MUSH connect to Database first!");
  return trelloDatabaseInstant;
};

export const CLOSE_DB = async () => {
  await mongoClientInstant.close();
};
