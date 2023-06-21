const core = require('@actions/core')
const axios = require('axios')
const fs = require('fs')

const apiKey = core.getInput('api_key', { required: true })
const apiUser = core.getInput('api_user', { required: true })
const apiOrg = core.getInput('api_org', { required: true })

let jsonData

const sendVulnerabilities = async (reserveCveId, callback) => {
    if(reserveCveId === null){
        return new Error('Reserve a CVE ID from MITRE test instance first')
    }

    const url = `https://cveawg-test.mitre.org/api/cve/${reserveCveId}/cna`
    const headers = {
        'CVE-API-ORG': apiOrg,
        'CVE-API-USER': apiUser,
        'CVE-API-KEY': apiKey,
    }

    const filePath = core.getInput('file_path', { required: true })
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        core.setOutput('file_content', fileContent)
        // console.log(fileContent);
        if (fileContent === null) {
            check = false
            return;
        }
        check = true

        jsonData = JSON.parse(fileContent)
    } catch (e) {
        core.setFailed(e.message)
    }

    try {
        const sendData = await axios.post(url, jsonData, { headers, setTimeout  : 9000 } )
        callback(sendData.data)
        // console.log(sendData.message);

    } catch (e) {
        core.setOutput(`Error: Failed to upload CVE data to MITRE test isntance: ${e.message}`)
    }
}

sendVulnerabilities();

module.exports = {sendVulnerabilities, fileContent}