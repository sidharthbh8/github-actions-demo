# CVE Reports Publication Automation

CVE Reports Publication Automation is a pipeline project for [Zowe](https://github.com/zowe). In order to automate and streamline the process of Common Vulnerabilities and Exposures (CVE) publication using GitHub Actions workflow to the MITRE test instance. It validates the JSON data provided in the `data.json` file, reserves a CVE ID, and then pushes the CVE file with the reserved ID to the MITRE test instance. Additionally, it sends the link to the user as a comment in the Pull Request (PR) that triggered the workflow.

## How to Use

To use this workflow in your repository, follow these steps:

1. Create a file named `data.json` in the root directory of your repository. Ensure that the file contains the CVE data in the `cnaContainer` format.

2. Make sure you have defined the required secrets (such as `YOUR_API_KEY`, `YOUR_API_USER`, and `YOUR_API_ORG`) in your repository's secrets settings. These secrets are used to authenticate with the MITRE test instance API.

3. Push the changes to your repository, and the workflow will be triggered automatically whenever a Pull Request is opened or reopened on the `master` branch. You can also manually trigger the workflow from the Actions tab.

## Workflow Architecture
![CVE Automation Workflow Architecture](https://i.imgur.com/liDuRCu.jpg)

## Project Structure

The src consists of the following files:

- `index.js`: The main script that throws a greetings message and extract the cve form `data.json` file. It leverage the functions form securityUtils to process the upload of CVEs.

- `securityUtils.js`: A helper script that extracts vulneribilites that needs to be reported, validates the JSON data, reserves a CVE ID, and uploads the CVE file to the MITRE test instance.

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

## Testing

In this section, we'll provide an overview of the unit tests and their coverage for the different components of the whole workflow.
The tests for this project can be found in the [tests](./tests/) directory.

### Unit Tests

### [reserveIdTest.test.js](./tests/reserveId.test.js)

This test suite covers the functionality of the `reserveCveId` logic from the `reserveId.js` file.

- Test case: Should reserve a CVE ID
- Test case: Should handle no data received
- Test case: Should handle axios.post error
- Test case: should handle axios.post rejection
- Test case: should handle axios.post exception
- Test case: should handle callback error
- Test case: should handle invalid type for amount

### [sendCveTest.test.js](./tests/sendCveTest.test.js)

This test suite covers the functionality of the `sendVulnerabilities` logic from the `sendCveTest.js` file.

- Test case: should handle null CVE ID
- Test case: Should handle file read error
- Test case: should handle API call success
- Test case: Should handle API call error
- Test case: Should handle file reading error
- Test case: Should handle successful file reading
- Test case: Should handle unsuccessful API call
- Test case: should handle file reading error with core setFailed

### [jsonSchema.test.js](./tests/jsonSchema.test.js)

This test suite covers the functionality of the `cveStructureValidator` logic from the `validator/validate.js` file.

- Test case: Should validate a basic minimum required valid JSON structur
- Test case: Should validate a advance valid JSON structure
- Test case: should report errors for invalid JSON structure
- Test case: should handle undefined file content
- Test case: should handle JSON parsing error
- Test case: should handle validation failure

### [index.test.js](./tests/index.test.js)

This test suite covers the overall workflow of the `main` function in the `index.js` file.

- Test case: Should handle successful execution with valid description

### Integration Tests

Please note that due to the complexity and requirements of interacting with external services like GitHub and Mitre, full end-to-end integration tests against live instances are not currently part of the test suite. These tests would involve actions like creating PRs, verifying comments, and reserving IDs on Mitre's test instance.

While we understand the value of such tests, the logistics of setting up and maintaining separate instances and the time constraints prevent us from implementing them fully at this time. As a result, the integration tests included in the test suite may involve mocked behavior to simulate interactions with these services.

### Test Coverage

Aiming for comprehensive test coverage to ensure the reliability of the codebase. Each test suite is designed to cover different scenarios and edge cases, including success and error cases. We also use mocking to isolate components and simulate different scenarios.

To run the tests locally, you can use the following command:

```
npm test
```
## Building CVE Reports Publication Automation from Source

The first time you download the project from GitHub repository, issue the following command to install the dependencies and several development tools:

```
npm install
```

To build your code changes, issue the following command:

```
npm run build
```
