# Config variables

Store your .env file here if needed.
Variables required.

- `API_KEY`: Your API key
- `PLURALSIGHT_ENDPOINT`: endpoint to the GraphQL API endpoint
- `MANAGER_PERMISSION_SET_ID`: permissions set ID used for new Team Managers (a simple "LIMTED" won't cut it anymore)
- `INPUT_FILE`: a string representing path and filename to use as input. Sample provided in the input folder.

If not via a .env file, make sure those variables are avilable via `process.env`.