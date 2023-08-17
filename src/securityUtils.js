const core = require('@actions/core')
const reserveCveId = require('./reserveId')
const { sendVulnerabilities, fileContent } = require('./sendCveTest')
const cveStructureValidator = require('./validator/validate')

const vulnerabilitiesCount = (description) => {
    const regex = /Amount of vulnerabilities reporting - (\d+)/
    const match = description.match(regex)
    if (match && match[1]) {
        return match[1]
    }
    return null
}

const createIssueComment = async (octokit, commentBody, prNumber) => {
    try {
        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: prNumber,
            body: commentBody
        });
    } catch (e) {
        core.setOutput(e.message)
    }
}

const handleCveReservationsAndUpload = async (octokit, prNumber, number) => {
    let check

    if (fileContent === null) {
        check = false
        return;
    }
    check = true

    try {
        cveStructureValidator(fileContent, async (error, validatedStructure) => {
            if (error) {
                await createIssueComment(octokit, error, prNumber)
            }
            else {
                await createIssueComment(octokit, validatedStructure, prNumber)

                await reserveCveId(check, number, async (idNumber) => {
                    const commentBody = `Here is your reserved CVE ID ${idNumber} to upload the CVE to MITRE test instance`;

                    await createIssueComment(octokit, commentBody, prNumber);

                    await sendVulnerabilities(idNumber, async (res) => {
                        const responseCommentBody = `Successfully Uploaded CVE Report to MITRE test instance: ${res}`;

                        await createIssueComment(octokit, responseCommentBody, prNumber);
                    })
                })
            }
        })
    } catch (e) {
        core.setOutput(e.message);
    }
}

module.exports = { vulnerabilitiesCount, handleCveReservationsAndUpload }