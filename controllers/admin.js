import Technology from "../Models/Technology.js";
import Database from "../Helpers/Database.js";
import Project from "../Models/Project.js";
import { __dirname } from "../index.js";
import path from 'path';
import fs from 'fs'

// Middleware for validating project addition form
export const validateProjectAddition = async (req, res, next) => {
  if (req.method === "POST") {
    const { name, description, githubUrl, demoUrl, technologies } = req.body;
    const errors = {};

    // Check if all required fields are present
    if (!name || !description || !githubUrl || !demoUrl || !technologies) {
      if (!name) errors.name = "Name is required";
      if (!description) errors.description = "Description is required";
      if (!githubUrl) errors.githubUrl = "Github URL is required";
      if (!demoUrl) errors.demoUrl = "Demo URL is required";
      if (!technologies) errors.technologies = "Technologies are required";
    } else {
      // Validate field lengths and URL formats
      if (name.length < 3) errors.name = "Name must be at least 3 characters";
      if (description.length < 10)
        errors.description = "Description must be at least 10 characters";
      if (technologies.length < 1)
        errors.technologies = "Technologies are required";

      try {
        new URL(githubUrl);
        new URL(demoUrl);
      } catch (error) {
        if (error.message.includes(githubUrl))
          errors.githubUrl = "Invalid Github URL";
        if (error.message.includes(demoUrl))
          errors.demoUrl = "Invalid Demo URL";
      }
    }

    // Handle errors or proceed
    if (Object.keys(errors).length > 0) {
      const technologies = await Technology.find(); // Ensure async operation completes before rendering
      return res.render("Routes/Admin/Dashboard/add-project", {
        title: "Add Project",
        location: "Dashboard / Projects / Add",
        technologies,
        form: req.body, // Use req.body instead of modifying req object
        errors,
      });
    }
  }

  next(); // Proceed to next middleware/route handler
};

// Middleware for validating image file upload
export const validateImageFile = async (req, res, next) => {
  if (req.method === "POST") {
    if (!req.file) {
      return res.render("Routes/Admin/Dashboard/add-project", {
        title: "Add Project",
        location: "Dashboard / Projects / Add",
        technologies: await Technology.find(),
        form: req.body,
        errors: { image: "Image is required" },
      });
    } else {
        const { mimetype, size } = req.file;
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 1024 * 1024 * 2; // 2MB
    
        // Check if file is an image and size is within limit
        if (!allowedTypes.includes(mimetype)) {
            return res.render("Routes/Admin/Dashboard/add-project", {
              title: "Add Project",
              location: "Dashboard / Projects / Add",
              technologies: await Technology.find(),
              form: req.body,
              errors: { image: "Invalid image format" },
            });
        } else if (size > maxSize) {
            return res.render("Routes/Admin/Dashboard/add-project", {
                title: "Add Project",
    location: "Dashboard / Projects / Add",
                technologies: await Technology.find(),
                form: req.body,
                errors: { image: "Image size too large" },
            });
        }
    }
  }

  next(); // Proceed to next middleware/route handler
};

export const addProject = async (req, res) => {
  const db = await Database.getInstance();
  if (req.method === "POST") {
    const { name, description, githubUrl, demoUrl, technologies } = req.body;
    const image = req.file
    const imageName = saveFile(image, "./assets/Projects-images");
    const project = await Project.create({
      name,
      description,
      githubUrl,
      demoUrl,
      image: imageName,
      technologies,
    });
    return res.redirect("/admin/projects");
  }
  const technologies = await Technology.find();
  return res.render("Routes/Admin/Dashboard/add-project", {
    title: "Add Project",
    technologies,
    location: "Dashboard / Projects / Add",
    form: req.form ? req.form : {},
    errors: req.errors ? req.errors : {},
  });
};

function getFilename(originalname) {
  let arrName = originalname.split(".");
  let extension = arrName[arrName.length - 1];
  let nameWithoutExtension = arrName.slice(0, arrName.length - 1).join(".");
  let saveAs = `${nameWithoutExtension}.${extension}`;
  return saveAs;
}

function saveFile(file, location) {
  let saveAs = getFilename(file.originalname);
  let imageBuffer = file.buffer;
  let filePath = path.join(__dirname, location, saveAs);
  fs.writeFileSync(filePath, imageBuffer);
  return saveAs;
}

export const addTechnology = async (req, res) => {
  const db = await Database.getInstance();
  if (req.method === "POST") {
    req.errors = req.errors ? req.errors : {};
    req.form = req.body
    const { name } = req.body;
    if (name) {
      if (req.file) {
        if (req.file.mimetype == 'image/svg+xml') {
          const svg = req.file;
          const svgName = saveFile(svg, "./assets/Technlogies-images");
          const project = await Technology.create({
            name,
            logo: svgName,
          });
          return res.redirect("/admin/technologies");
        } else {
          req.errors.logo = "Only SVG files are allowed!";
        }
      } else {
        req.errors.logo = "Logo is required!"
      }
    } else {
      req.errors.name = "Name is required!"
    }
    
  }
  
  return res.render("Routes/Admin/Dashboard/add-technology", {
    title: "Add Technology",
    location: "Dashboard / Technologies / Add",
    form: req.form ? req.form : {},
    errors: req.errors ? req.errors : {},
  });
};