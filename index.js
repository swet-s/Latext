require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path'); 


const app = express();

const port = process.env.PORT || 3000; 

// Helper function to fetch LaTeX content from GitHub
const fetchLatexContent = async () => {
    const token = process.env.GITHUB_TOKEN;
    const repoOwner = 'swet-s';
    const repoName = 'CV';
    const filePath = 'resume.tex';

    try {
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3.raw'
            }
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('File not found in the repository.');
            } else if (error.response.status === 403) {
                throw new Error('Access denied or token does not have permission.');
            } else {
                throw new Error(`GitHub API error: ${error.response.status} - ${error.response.data.message}`);
            }
        } else if (error.request) {
            throw new Error('No response from GitHub. Possible network issue.');
        } else {
            throw new Error(`Error in setting up request: ${error.message}`);
        }
    }
};

app.get('/resume', async (req, res) => {
    try {
        const latexContent = await fetchLatexContent();
        res.status(200).send(latexContent);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/resumepdf', async (req, res) => {
    // Fetch LaTeX content
    const latexContent = await fetchLatexContent();

    // Set custom file name from query or default to 'resume.pdf'
    const fileName = req.query.filename ? `${req.query.filename}.pdf` : 'resume.pdf';

    // Write LaTeX code to file
    const texFilePath = path.join(__dirname, 'resume.tex');
    fs.writeFileSync(texFilePath, latexContent);

    // Compile LaTeX to PDF
    exec(`pdflatex -interaction=nonstopmode -output-directory ${__dirname} ${texFilePath}`, (error) => {
        if (error) {
            return res.status(500).send('Error generating PDF');
        }

        const pdfPath = path.join(__dirname, 'resume.pdf');

        // Check if the download flag is passed
        const shouldDownload = req.query.download === 'true';

        if (shouldDownload) {
            // Set headers for download with custom file name
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        }

        // Set the content type for PDF
        res.setHeader('Content-Type', 'application/pdf');

        // Send the PDF file
        res.sendFile(pdfPath, (err) => {
            if (err) {
                res.status(500).send('Error sending PDF');
            }

            // Clean up files
            fs.unlinkSync(texFilePath);
            fs.unlinkSync(pdfPath);
        });
    });
});


app.listen(port, () => {
    console.log('Server is running on port 3000');
});

