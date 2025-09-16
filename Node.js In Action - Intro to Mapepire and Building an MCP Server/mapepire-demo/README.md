# ConnectMe Server

This simple ConnectMe express server connects to Db2i and allows retrival and updates of accounts.

# Setup

1. Run the `connectme.sql` file to create the `CONNECTME` schema and `ACCOUNT` table.

2. Run `npm install` to install the server dependencies.

3. Run `npm run start` to start the server.

4a. Run `npm run swagger` to start the Swagger UI.

4b. Test the `GET` endpoint (`/accounts`) by opening the following link in your browser (make sure to replace `<host>` with your IBM i host name):

    ```
    http://<host>:3001/accounts?EMAIL_ADDRESS=john.doe@example.com&ACCOUNT_NUMBER=1111
    ```