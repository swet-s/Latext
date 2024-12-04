const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Helper function to fetch PDF content from GitHub
const fetchPdfContent = async () => {
    const token = process.env.GITHUB_TOKEN;
    const repoOwner = "swet-s";
    const repoName = "CV";
    const filePath = "resume.pdf";

    try {
        const response = await axios.get(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.v3.raw", // Ensure raw file content is fetched
                },
                responseType: "arraybuffer", // Ensures binary data is fetched for the PDF
            }
        );

        return response.data; 
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error("File not found in the repository.");
            } else if (error.response.status === 403) {
                throw new Error("Access denied or token does not have permission.");
            } else {
                throw new Error(
                    `GitHub API error: ${error.response.status} - ${error.response.data.message}`
                );
            }
        } else if (error.request) {
            throw new Error("No response from GitHub. Possible network issue.");
        } else {
            throw new Error(`Error in setting up request: ${error.message}`);
        }
    }
};


router.get("/resume", async (req, res) => {
    try {
        const pdfContent = await fetchPdfContent();
        const fileName = req.query.filename ? `${req.query.filename}.pdf` : "resume.pdf";
        const shouldDownload = req.query.download === "true";

        if (shouldDownload) {
            res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        }

        res.setHeader("Content-Type", "application/pdf");
        res.send(pdfContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
