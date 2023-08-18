const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const { vulnerabilitiesCount, handleCveReservationsAndUpload } = require('./securityUtils')

const main = async () => {
    try {
        const prNumber = core.getInput('pr_number', { required: true })
        const token = core.getInput('token', { required: true })
        // const personalToken = core.getInput('personal_token', { required: true})

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

        const number = vulnerabilitiesCount(description)
        console.log(`Written Number here ${number}`);
        
        await handleCveReservationsAndUpload(number)

    } catch (e) {
        core.setFailed(e.message)
    }
}

main();