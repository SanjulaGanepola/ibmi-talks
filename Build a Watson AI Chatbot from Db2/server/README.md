# ConnectMe Server

This simple ConnectMe express server connects to Db2i and allows retrival and updates of accounts.

# Setup

1. Run the `account.sql` file to create the `CONNECTME` schema and `ACCOUNT` table.

2. Run `npm install` to install the server dependencies.

3. Use the commands below to manage the server:

    ```sh
    ## Start server
    sc start connect-me.yaml

    ## Stop server
    sc stop connect-me.yaml
    
    ## Check server status
    sc check connect-me.yaml
    ```

4. Test the `GET` endpoint (`/accounts`) by opening the following link in your browser (make sure to replace `<host>` with your IBM i host name):

    ```
    http://<host>:3001/accounts?EMAIL_ADDRESS=john.doe@example.com&ACCOUNT_NUMBER=A123
    ```