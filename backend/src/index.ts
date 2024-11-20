import dotenv from "dotenv";
import Server from "./Server";

dotenv.config();

new Server(process.env.PORT!);
