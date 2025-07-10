import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
}
));
app.use(express.json()); // = a parse.json.body => req.body
app.use(rateLimiter);

// app.use ((req,res,next) =>{
//     console.log(`Méthode de la requête est ${req.method} & l'URL de la requête est ${req.url}`);
//     next();
// })

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on Port :", PORT);
    });
});