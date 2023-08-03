# CVE Reports Publication Automation

CVE Upload Automation is a GitHub Actions workflow that automates the process of reserving and uploading Common Vulnerabilities and Exposures (CVE) reports to the MITRE test instance. It validates the JSON data provided in the `data.json` file, reserves a CVE ID, and then pushes the CVE file with the reserved ID to the MITRE test instance. Additionally, it sends the link to the user as a comment in the Pull Request (PR) that triggered the workflow.

## How to Use

To use this workflow in your repository, follow these steps:

1. Create a file named `data.json` in the root directory of your repository. Ensure that the file contains the CVE data in the `cnaContainer` format.

2. Make sure you have defined the required secrets (such as `YOUR_API_KEY`, `YOUR_API_USER`, and `YOUR_API_ORG`) in your repository's secrets settings. These secrets are used to authenticate with the MITRE test instance API.

3. Push the changes to your repository, and the workflow will be triggered automatically whenever a Pull Request is opened or reopened on the `master` branch. You can also manually trigger the workflow from the Actions tab.

## Project Structure

The src consists of the following files:

- `index.js`: The main script that orchestrates the CVE upload process. It validates the JSON data, reserves a CVE ID, and uploads the CVE file to the MITRE test instance.

- `reserveId.js`: A helper script to reserve a CVE ID from the MITRE test instance API.

- `sendCveTest.js`: A helper script to send the CVE report to the MITRE test instance API.

- `validator/validate.js`: A helper script that contains the CVE data validation logic.

- `CVE_Schema/schema.json`: The JSON schema used to validate the `data.json` file against the CNA container format.

## Data.json Format

The `data.json` file must follow the `cnaContainer` format for CVE reports. The exact structure and required fields can be found in the `CVE_Schema/schema.json` file. Make sure your CVE data adheres to this format before running the workflow.

## Additional Information

The `reserveCveId` function is responsible for reserving a CVE ID from the MITRE test instance API. It requires the following inputs as environment variables:

- `api_key`: Your API key for authenticating with the MITRE test instance.
- `api_user`: Your API user for authentication.
- `api_org`: Your API organization for authentication.
- `check`: A boolean value indicating whether the CVE data is available for reservation.
- `amount`: The number of CVE IDs to reserve.

The function uses the `axios` library to make HTTP requests to the MITRE test instance API. If the CVE ID is successfully reserved, the `callback` function will receive the reserved CVE ID.

### This README is a work in progress and may change as unit tests, architecture enhancements, and new features are added. Please note that the project is still under active development, and its current state may not reflect the final version.
