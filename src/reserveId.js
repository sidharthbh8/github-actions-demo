const core = require('@actions/core')
const axios = require('axios')

const apiKey = core.getInput('api_key', { required: true })
const apiUser = core.getInput('api_user', { required: true })
const apiOrg = core.getInput('api_org', { required: true })

const reserveCveId = async (check, amount, callback) => {
    if (check === false) {
        return new Error('No data recieved, send CVE data in order to reserve the CVE ID')
    }

    const year = new Date().getFullYear()
    const orgName = `Zowe`
    const url = `https://cveawg-test.mitre.org/api/cve-id?amount=${amount}&cve_year=${year}&short_name=${orgName}`
    const headers = {
        'CVE-API-ORG': apiOrg,
        'CVE-API-USER': apiUser,
        'CVE-API-KEY': apiKey,
    }

    try {
        const reservedCveId = await axios.post(url, null, { headers })
        callback(reservedCveId.data.cve_ids[0].cve_id)
        // console.log('Reserved CVE ID:', reservedCveId.data.cve_ids[0].cve_id)
    } catch (e) {
        console.error(`Error: Failed to reserve CVE ID: ${e}`)
    }
}

reserveCveId();

module.exports = reserveCveId