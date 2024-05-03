import express from "express";
import Database from "../Helpers/Database.js";
import Admin from "../Models/Admin.js";
import CryptoJS from "crypto-js";
import Project from "../Models/Project.js";
import Technology from "../Models/Technology.js";
import multer from "multer";
import { addProject, addTechnology, validateImageFile, validateProjectAddition } from "../controllers/admin.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = new express.Router();

router.param("projectId", async (req, res, next, projectId) => {
  try {
    const project = await Project.findById(projectId);
    req.project = project;
    next();
  } catch (er) {
    res.redirect("/admin/dashboard");
  }
});

router.param("technologyId", async (req, res, next, technologyId) => {
  try {
    const technology = await Technology.findById(technologyId);
    req.technology = technology;
    next()
  } catch (er) {
    res.redirect("/admin/dashboard");
  }
});

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
  res.render("Routes/Admin/Dashboard/index", {
    title: "Dashboard",
    location: "Dashboard",
  });
});

router.get("/projects", isAuthenticated, async (req, res) => {
  const db = await Database.getInstance();
  const Projects = await Project.find().populate("technologies");
  res.render("Routes/Admin/Dashboard/projects", {
    title: "Projects",
    location: "Dashboard / Projects",
    Projects,
  });
});

router.get("/technologies", isAuthenticated, async (req, res) => {
  const db = await Database.getInstance();
  const Technologies = await Technology.find();
  res.render("Routes/Admin/Dashboard/technologies", {
    title: "Technologies",
    location: "Dashboard / Technologies ",
    Technologies,
  });
});

router.use(
  "/projects/add",
  isAuthenticated,
  upload.single("image"),
  validateProjectAddition,
  validateImageFile,
  addProject
);

router.use(
  "/technologies/add",
  isAuthenticated,
  upload.single("image"),
  addTechnology
);

router.get("/projects/delete/:projectId", isAuthenticated, async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.project._id);
    res.redirect("/admin/projects");
  } catch (err) {
    console.log(err);
    return res.redirect("/admin/dashboard");
  }
});

router.get(
  "/technologies/delete/:technologyId",
  isAuthenticated,
  async (req, res) => {
    try {
      await Technology.findByIdAndRemove(req.technology._id)
      res.redirect('/admin/technologies')
    } catch (err) {
      console.log(err)
      return res.redirect('/admin/dashboard')
    }
  }
)

router.get("/logout", isAuthenticated, async (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

export default router;
