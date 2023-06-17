const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs');
const { context } = require('../dist')

const main = async () => {
    const filePath = core.getInput('file_path', { required: true })
    const prNumber = core.getInput('pr_number', { required: true })
    const token = core.getInput('token', { required: true })

    const octokit = new github.getOctokit(token)

    // const { owner, repo } = github.context.payload

    // console.log(github.context.payload);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        core.setOutput('file_content', fileContent)

    } catch (e) {
        core.setFailed(e.message)
    }

    const prData = await octokit.rest.pulls.listFiles({
        owner: owner,
        repo: repo,
        pull_number: prNumber,
    });

    console.log(prData);
        
    const { pull_request } = github.payload;

    await octokit.rest.issues.createComment({
        owner: 'sidharthbh8',
        repo: 'github-actions-demo',
        issue_number: pull_request.number,
        body: 'Thank you for submitting your pull request! we soon going to upload your data to MITRE test instance'
    })
}

main()