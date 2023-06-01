import express from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

let PORT = 8000;

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.send("🎉 🚀 🎉 🚀 🎉 🚀 🎉 🚀 🎉 🚀 🎉 🚀 🎉 🚀 🎉 🚀");
});

app.get("/reviews", async (_, res) => {
  try {
    const reviews = await prisma.movieItem.findMany();
    res.status(200).json({ reviews });
  } catch {
    res.status(500).json({ error: "failed to fetch data"})
  }
});

app.get("/reviews/:id", async (req, res) => {
  if (!req.body || !req.params.id) {
    res.status(400).send("missing");
  }
  
  const id = parseInt(req.params.id);
  const review = await prisma.movieItem.findUnique({
    where: {
      id: id,
    }
  })
  if (review) {
    res.status(200).json(review)
  } else {
    res.status(404).json({error: "not found"})
  }
})

app.post("/reviews", async (req, res) => {
  const { title, username } = req.body;
  const movieItem = await prisma.movieItem.create({
    data: {
      title: title,
      username: username,
    },
  })
  res.status(201).json(movieItem);
});

app.put("/reviews/:id", async (req, res) => {
  if (!req.body || !req.params.id) {
    res.status(400).send("missing");
  }
  
  const id = parseInt(req.params.id);
  let title = req.body.title;

  const movieItem = await prisma.movieItem.update({
    where: {
      id: id,
    },
    data: {
      title: title,
    },
  });

  if (movieItem) {
    res.status(200).send();
  } else {
    res.status(404).send(`Review ${req.params.id} not found`);
  }
});

app.delete("/reviews/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const movieItem = await prisma.movieItem.delete({
    where: {
      id: id,
    },
  });

  if (movieItem) {
    res.status(200).send(movieItem);
  } else {
    res.status(404).send(`Review ${req.params.id} not found`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
