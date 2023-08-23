const core = require('@actions/core')
const github = require('@actions/github')
const reserveCveId = require('./reserveId')
const { sendVulnerabilities, fileContent } = require('./sendCveTest')
const cveStructureValidator = require('./validator/validate')

const prNumber = core.getInput('pr_number', { required: true })
const token = core.getInput('token', { required: true })
const octokit = new github.getOctokit(token)
const context = github.context

const vulnerabilitiesCount = (description) => {
    const regex = /Amount of vulnerabilities reporting - (\d+)/
    const match = description.match(regex)
    if (match && match[1]) {
        return match[1]
    }
    return null
}

const createIssueComment = async (commentBody) => {
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

const handleCveReservationsAndUpload = async (number) => {
    let check

    if (fileContent === null) {
        check = false
        core.setOutput('File is empty')
        return;
    }
    check = true

    try {
        cveStructureValidator(fileContent, async (error, validatedStructure) => {
            if (error) {
                await createIssueComment(error)
            }
            else {
                await createIssueComment(validatedStructure)

                await reserveCveId(check, number, async (idNumber) => {
                    const commentBody = `Here is your reserved CVE ID ${idNumber} to upload the CVE to MITRE test instance`;

                    await createIssueComment(commentBody)

                    await sendVulnerabilities(idNumber, async (res) => {
                        const responseCommentBody = `Successfully Uploaded CVE Report to MITRE test instance: ${res}`;

                        await createIssueComment(responseCommentBody);
                    })
                })
            }
        })
    } catch (e) {
        core.setOutput(e.message);
    }
}

module.exports = { vulnerabilitiesCount, handleCveReservationsAndUpload, createIssueComment }