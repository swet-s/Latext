require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const port = process.env.PORT || 3000; 

app.get('/resume', async (req, res) => {
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

        res.status(200).send(response.data);

    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                res.status(404).send('File not found in the repository.');
            } else if (error.response.status === 403) {
                res.status(403).send('Access denied or token does not have permission.');
            } else {
                res.status(500).send(`GitHub API error: ${error.response.status} - ${error.response.data.message}`);
            }
        } else if (error.request) {
            res.status(500).send('No response from GitHub. Possible network issue.');
        } else {
            res.status(500).send(`Error in setting up request: ${error.message}`);
        }
    }
});

app.listen(port, () => {
    console.log('Server is running on port 3000');
});

