const cors = require('cors')
const dotenv = require('dotenv');
const express = require('express');
const { SQLJob } = require('@ibm/mapepire-js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log({
        method: req.method,
        url: req.originalUrl,
        query: req.query,
        body: req.body,
        status: res.statusCode
    });
    next();
});

async function createSQLJob() {
    const job = new SQLJob();
    await job.connect({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        port: process.env.port,
        rejectUnauthorized: false
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
            res.json({
                EMAIL_ADDRESS: result.data[0].EMAIL_ADDRESS,
                NAME: result.data[0].NAME,
                ACCOUNT_NUMBER: result.data[0].ACCOUNT_NUMBER,
                MESSAGE: 'Successfully retrieved account.'
            });
        } else {
            res.status(404).json({
                MESSAGE: `Account with email address ${EMAIL_ADDRESS} not found.`
            });
        }
    } catch (error) {
        res.status(500).json({
            MESSAGE: `Internal server error: ${error}`
        });
    } finally {
        if (job) {
            await job.close();
        }
    }
});

app.put('/accounts', async (req, res) => {
    // Extract and verify required body parameters
    const { EMAIL_ADDRESS, NAME, ACCOUNT_NUMBER } = req.body;

    let job;
    try {
        // Create SQL job
        job = await createSQLJob();

        // Execute query
        const query = `UPDATE CONNECTME.ACCOUNT SET NAME = ?, ACCOUNT_NUMBER = ? WHERE EMAIL_ADDRESS = ?`;
        const parameters = [NAME, ACCOUNT_NUMBER, EMAIL_ADDRESS];
        const result = await job.execute(query, { parameters: parameters });

        // Check result
        if (result.success && result.update_count === 1) {
            res.json({
                MESSAGE: `Successfully updated account`
            });
        } else {
            res.status(404).json({
                MESSAGE: `Account with email address ${EMAIL_ADDRESS} not found.`
            });
        }
    } catch (error) {
        res.status(500).json({
            MESSAGE: `Internal server error: ${error}`
        });
    } finally {
        if (job) {
            await job.close();
        }
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`ConnectMe server is running on http://localhost:${PORT}`);
});