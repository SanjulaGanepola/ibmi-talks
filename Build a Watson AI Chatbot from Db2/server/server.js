const cors = require('cors')
const dotenv = require('dotenv');
const express = require('express');
const { SQLJob } = require('@ibm/mapepire-js');

dotenv.config();

const app = express();
app.use(cors());

async function createSQLJob() {
    const job = new SQLJob();
    await job.connect({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        port: process.env.port,
        ignoreUnauthorized: true
    });

    return job;
}

app.get('/accounts', async (req, res) => {
    // Extract and verify required query parameters
    const { EMAIL_ADDRESS } = req.query;

    let job;
    try {
        // Create SQL job
        job = await createSQLJob();

        // Execute query
        const query = `SELECT * FROM CONNECTME.ACCOUNT WHERE EMAIL_ADDRESS = ?`;
        const parameters = [EMAIL_ADDRESS];
        const result = await job.execute(query, { parameters: parameters });

        // Check result
        if (result.success && result.data.length > 0) {
            res.json(result.data[0]);
        } else {
            res.status(500).json({ message: `Failed to retrieve account with email address ${EMAIL_ADDRESS}.` });
        }
    } catch (error) {
        res.status(500).json({ message: `Internal server error.` });
    } finally {
        await job.close();
    }
});

app.put('/accounts', async (req, res) => {
    // Extract and verify required body parameters
    const { EMAIL_ADDRESS, NAME, ACCOUNT_NUMBER } = req.body;

    try {
        // Create SQL job
        const job = await createSQLJob();

        // Execute query
        const query = NAME ?
            `UPDATE CONNECTME.ACCOUNT SET NAME = ? WHERE EMAIL_ADDRESS = ?` :
            `UPDATE CONNECTME.ACCOUNT SET ACCOUNT_NUMBER = ? WHERE EMAIL_ADDRESS = ?`;
        const parameters = NAME ?
            [NAME, EMAIL_ADDRESS] :
            [ACCOUNT_NUMBER, EMAIL_ADDRESS];
        const result = await job.execute(query, { parameters: parameters });

        // Check result
        if (result.success) {
            res.json({ message: `Successfully updated account` });
        } else {
            res.status(500).json({ message: `Failed to update account with email address ${EMAIL_ADDRESS}.` });
        }
    } catch (error) {
        res.status(500).json({ message: `Internal server error.` });
    } finally {
        await job.close();
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`ConnectMe server is running on http://localhost:${PORT}`);
});