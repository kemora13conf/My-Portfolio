import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Database from "./Helpers/Database.js";
import Technology from "./Models/Technology.js";
import Project from "./Models/Project.js";

const app = express();
const port = 3000;

const db = await Database.getInstance();
const projs = await Project.find();
if (projs.length === 0) {
  await Project.deleteMany();
  await Technology.deleteMany();

  let techList = [
    { name: "Node.js", logo: "Node js.svg" },
    { name: "React.js", logo: "React js.svg" },
    { name: "Vue.js", logo: "Vue js.svg" },
    { name: "Angular.js", logo: "Angular js.svg" },
    { name: "Express.js", logo: "express.png" },
    { name: "MongoDB", logo: "Mongo db.svg" },
  ];

  techList = await Technology.insertMany(techList);

  let projectList = [
    {
      name: "Highlighter code preview",
      description:
        "Highlighter is javascript package helps to format your code sample and display them like a code editor.",
      githubUrl: "https://github.com/abdo487/Highlighter.git",
      demoUrl: "http://abdelghanielmouak.me/Highlighter/Demo",
      image: "Highlighter.jpg",
      technologies: [techList[0]._id, techList[1]._id, techList[4]._id, techList[5]._id],
    },
    {
      name: "E-commerce store Admin panel",
      description: "E-commerce store Admin panel is a dashboard for managing products, orders, and users.",
      githubUrl: "https://github.com/abdo487/Store-Api-Dashboard.git",
      demoUrl: "",
      image: "E-Store.jpg",
      technologies: [techList[0]._id, techList[1]._id, techList[4]._id, techList[5]._id],
    }
  ];

  projectList = await Project.insertMany(projectList);
}

app.set("view engine", "ejs");

export const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.set("views", path.join(__dirname, "public"));

app.get("/", async (req, res) => {
  const db = await Database.getInstance();
  let Projects = await Project.find().populate("technologies");
  res.render("Routes/Portfolio/index", { title: "Home", Projects });
});

app.listen(port, () => {
  console.log(`running on port http://localhost:${port}`);
});
