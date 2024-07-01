const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const archiver = require("archiver");
const Job = require("../models/job.model");
const checkPerms = require("../middlewares/checkPermissions");
const formatCreatedAt = require("../utilies/formatCreatedAt");

const uploadPath = path.join(__dirname, "..", "assets", "files", "uploadedCVs");

// GET jobs page
router.get("/careers", checkPerms("canManageCareers"), async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.render("admin/careers/jobs", {
      jobs,
      formatCreatedAt,
      currentLocale: res.getLocale(),
    });
  } catch (err) {
    res.send("Internal Server Error");
  }
});

// GET addJob page
router.get(
  "/careers/add-job",
  checkPerms("canManageCareers"),
  async (req, res) => {
    try {
      res.render("admin/careers/add-job");
    } catch (err) {
      res.send("Internal Server Error");
    }
  }
);

// GET viewCVs page
router.get(
  "/careers/cvs/:id",
  checkPerms("canManageCareers"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Job.findById(id);
      res.render("admin/careers/view-cvs", {
        id: job._id,
        CVs: job.uploadedCVs,
        currentLocale: res.getLocale(),
      });
    } catch (err) {
      res.send("Internal Server Error");
    }
  }
);

// POST new job
router.post(
  "/careers/add-job",
  checkPerms("canManageCareers"),
  async (req, res) => {
    try {
      const {
        title,
        location,
        type,
        department,
        salary,
        jobDesc,
        jobReqs,
        tags,
      } = req.body;

      const newJob = new Job({
        title,
        location,
        type,
        department,
        salary,
        jobDesc,
        jobReqs,
        tags,
      });
      await newJob.save();
      req.flash("success", {
        title: "Success",
        msg: "New job has been added successfully",
        done: true,
      });
      res.redirect(`/dashboard/careers`);
    } catch (err) {
      console.log(err);
      res.send("Internal server error.");
    }
  }
);

// DELETE a job
router.post(
  "/careers/delete",
  checkPerms("canManageCareers"),
  async (req, res) => {
    try {
      const { id } = req.body;
      await Job.findByIdAndDelete(id);
      req.flash("success", {
        title: "Success",
        msg: "Job has been deleted successfully",
      });
      res.redirect("/dashboard/careers");
    } catch (err) {
      res.send("Internal Server Error");
    }
  }
);

// DOWNLOAD a CV
router.get(
  "/careers/download-cv/:cvName",
  checkPerms("canManageCareers"),
  (req, res) => {
    const { cvName } = req.params;
    const cvPath = path.join(uploadPath, cvName);
    if (fs.existsSync(cvPath)) {
      res.download(cvPath);
    } else {
      res.status(404).send("CV not found");
    }
  }
);

// DELETE a CV
router.post(
  "/careers/delete-cv/",
  checkPerms("canManageCareers"),
  async (req, res) => {
    const { jobId, cvName } = req.body;
    const cvPath = path.join(uploadPath, cvName);

    try {
      // Check if the CV file exists
      if (fs.existsSync(cvPath)) {
        // Delete the CV file
        fs.unlinkSync(cvPath);
        // Find the job and update the uploadedCVs array
        const job = await Job.findById(jobId);
        if (job) {
          const index = job.uploadedCVs.findIndex((cv) => cv.includes(cvName));
          if (index > -1) {
            job.uploadedCVs.splice(index, 1);
            await job.save();
            req.flash("success", {
              title: "Success",
              msg: "CV has been deleted successfully",
              done: true,
            });
            res.redirect(`/dashboard/careers/cvs/${jobId}`);
          } else {
            res.status(404).send("CV not found in job");
          }
        } else {
          res.status(404).send("Job not found");
        }
      } else {
        res.status(404).send("CV not found");
      }
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// DELETE ALL CVs
router.post(
  "/careers/delete-all/:jobId",
  checkPerms("canManageCareers"),
  async (req, res) => {
    const { jobId } = req.params;
    try {
      // Find the job
      const job = await Job.findById(jobId);
      if (job) {
        // Delete each CV file physically from storage
        job.uploadedCVs.forEach((cv) => {
          const cvPath = path.join(uploadPath, cv);
          if (fs.existsSync(cvPath)) {
            fs.unlinkSync(cvPath);
          }
        });

        // Set uploadedCVs to an empty array
        job.uploadedCVs = [];
        await job.save();

        req.flash("success", {
          title: "Success",
          msg: "All CVs has been deleted successfully",
          done: true,
        });
        res.redirect(`/dashboard/careers/cvs/${jobId}`);
      } else {
        res.status(404).send("Job not found");
      }
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// DOWNLOAD ALL CVs
router.get(
  "/careers/download-all/:jobId",
  checkPerms("canManageCareers"),
  async (req, res) => {
    const { jobId } = req.params;
    try {
      // Find the job
      const job = await Job.findById(jobId);
      if (job) {
        // Create a ZIP archive
        const archive = archiver("zip", {
          zlib: { level: 9 }, // Compression level
        });

        // Set the output file name
        const zipFileName = `CVs-${jobId}.zip`;

        // Set the response headers
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${zipFileName}`
        );
        res.setHeader("Content-Type", "application/zip");

        // Pipe the archive data to the response
        archive.pipe(res);

        // Add each CV file to the archive
        job.uploadedCVs.forEach((cv) => {
          const cvPath = path.join(uploadPath, cv);
          if (fs.existsSync(cvPath)) {
            archive.file(cvPath, { name: cv });
          }
        });
        // Finalize the archive
        archive.finalize();
      } else {
        res.status(404).send("Job not found");
      }
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
