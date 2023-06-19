const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs');
// const { context } = require('../dist')

const main = async () => {
    const filePath = core.getInput('file_path', { required: true })
    const prNumber = core.getInput('pr_number', { required: true })
    const token = core.getInput('token', { required: true })
    const personalToken = core.getInput('personal_token', { required: true})

    const{ Octokit }= require("@octokit/rest")
    const octokit = new Octokit({
        auth: token,
      });

    // console.log(github.context.payload);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        core.setOutput('file_content', fileContent)
        console.log(fileContent);
    } catch (e) {
        core.setFailed(e.message)
    }

    const prData = await octokit.rest.pulls.listFiles({
        owner: 'sidharthbh8',
        repo: 'zowe-cve-publication',
        pull_number: prNumber,
    });

    const { pull_request } = github.context.payload

    console.log(prData.data);
    console.log(pull_request.number);

    // await octokit.rest.issues.createComment({
    //     owner: 'sidharthbh8',
    //     repo: 'zowe-cve-publication',
    //     issue_number: pull_request.number,
    //     body: 'Thank you for submitting your pull request! we soon going to upload your data to MITRE test instance'
    // })
}

main()