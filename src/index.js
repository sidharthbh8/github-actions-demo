const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const reserveCveId = require('./reserveId')
const { sendVulnerabilities } = require('./sendCveTest')
const cveStructureValidator = require('./validator/validate')

let fileContent

const main = async () => {
    try {
        const prNumber = core.getInput('pr_number', { required: true })
        const token = core.getInput('token', { required: true })
        const filePath = core.getInput('file_path', { required: true })
        fileContent = fs.readFileSync(filePath, 'utf8')
        core.debug('File Content1:', fileContent);
        // const personalToken = core.getInput('personal_token', { required: true})
        let check

        const octokit = new github.getOctokit(token);
        const context = github.context
        // console.log(github.context.payload);

        const prData = await octokit.rest.pulls.listFiles({
            ...context.repo,
            pull_number: prNumber,
        });

        // console.log(prData);

        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: prNumber,
            body: `Thank you for submitting your pull request! we soon going to reserve an id for you and later upload your data to MITRE test instance`
        })

        const response = await octokit.rest.pulls.get({
            ...context.repo,
            pull_number: prNumber,
        });
        const { data } = response
        const description = data.body

        const vulnerabilitiesCount = (description) => {
            const regex = /Amount of vulnerabilities reporting - (\d+)/
            const match = description.match(regex)
            if (match && match[1]) {
                return match[1]
            }
            return null
        }
        const number = vulnerabilitiesCount(description)
        console.log(`Written Number here ${number}`);

        if (fileContent === null) {
            check = false
            return;
        }
        check = true

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

        try {
            reserveCveId(check, number, async (idNumber) => {
                const commentBody = `Here is your reserved CVE ID ${idNumber} to upload the CVE to MITRE test instance`;

                await createIssueComment(commentBody);

                core.debug('File Content2:', fileContent);
                console.log('File Content:', fileContent);
                cveStructureValidator(fileContent, async (error, result) => {
                    if(error){
                        await createIssueComment(error)
                    }
                    else{
                        await createIssueComment(result)
                    }
                })

                sendVulnerabilities(idNumber, async (res) => {
                    const responseCommentBody = `Successfully Uploaded CVE Report to MITRE test instance: ${res}`;

                    await createIssueComment(responseCommentBody);
                })
            })
        } catch (e) {
            core.setOutput(e.message);
        }


    } catch (e) {
        core.setFailed(e.message)
    }
}

main();