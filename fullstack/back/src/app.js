import express from "express";
import morgan from "morgan";


//Routes
import bugtrackerRoutes from "./routes/bugtracker.routes";

const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

//Settings
app.set("port", 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/api/bugtracker", bugtrackerRoutes);



export default app;