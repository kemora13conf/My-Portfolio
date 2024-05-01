import express from "express";
import Database from "../Helpers/Database.js";
import Admin from "../Models/Admin.js";
import CryptoJS from "crypto-js";
import Project from "../Models/Project.js";
import Technology from "../Models/Technology.js";
import multer from "multer";
import { validateImageFile, validateProjectAddition } from "../controllers/admin.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = new express.Router();

router.use("/login", async (req, res) => {
  if (req.session.admin) return res.redirect("/admin/dashboard");
  // check if theres is no admin in the database then create one
  const db = await Database.getInstance();
  const admins = await Admin.find();
  if (admins.length === 0) {
    await Admin.create({
      username: "admin",
      email: "abdelghanielmouak@gmail.com",
      hashed_password: "admin",
    });
  }

  if (req.method === "POST") {
    const { email, password } = req.body;
    const db = await Database.getInstance();
    const admin = await Admin.findOne({ email });
    if (admin) {
      if (admin.hashed_password === CryptoJS.SHA256(password).toString()) {
        req.session.admin = admin;
        return res.redirect("/admin/dashboard");
      } else {
        return res.render("Routes/Admin/Auth/index", {
          title: "Login",
          errors: {
            password: "Invalid password",
          },
        });
      }
    }
    return res.render("Routes/Admin/Auth/index", {
      title: "Login",
      errors: {
        email: "Invalid email",
      },
    });
  }
  return res.render("Routes/Admin/Auth/index", { title: "Login", errors: {} });
});

const isAuthenticated = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  next();
};

router.get("/dashboard", isAuthenticated, async (req, res) => {
  res.render("Routes/Admin/Dashboard/index", { title: "Dashboard" });
});

router.get("/projects", isAuthenticated, async (req, res) => {
  const db = await Database.getInstance();
  const Projects = await Project.find().populate("technologies");
  res.render("Routes/Admin/Dashboard/projects", {
    title: "Dashboard",
    Projects,
  });
});

router.use(
  "/projects/add",
  isAuthenticated,
  upload.single("image"),
  validateProjectAddition,
  validateImageFile,
  async (req, res) => {
    if (req.method === "POST") {
      const { name, description, githubUrl, demoUrl, technologies } = req.body;
      const image = req.file.buffer.toString("base64");
      const db = await Database.getInstance();
      const project = await Project.create({
        name,
        description,
        githubUrl,
        demoUrl,
        image,
        technologies,
      });
      return res.redirect("/admin/projects");
    }
    const db = await Database.getInstance();
    const technologies = await Technology.find();
    return res.render("Routes/Admin/Dashboard/add-project", {
      title: "Add Project",
      technologies,
      form: req.form ? req.form : {},
      errors: req.errors ? req.errors : {},
    });
  }
);

router.get("/logout", isAuthenticated, async (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

export default router;
