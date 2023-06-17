const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs');
const { context } = require('../dist')

const main = async () => {
    const filePath = core.getInput('file_path', { required: true })
    const prNumber = core.getInput('pr_number', { required: true })
    const token = core.getInput('token', { required: true })

    const octokit = new github.getOctokit(token)
    const { owner, repo } = github.context.repo

    // console.log(github.context.payload);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        core.setOutput('file_content', fileContent)

        console.log(fileContent);
    } catch (e) {
        core.setFailed(e.message)
    }
  
    console.log('ABOVE FILE CONTENT BELOW IS PR DATA');

    const prData = await octokit.rest.pulls.listFiles({
        owner: owner,
        repo: repo,
        pull_number: prNumber,
    });

    console.log(prData);
    
    await octokit.issues.createComment({
        ...context.repo,
        issue_number: prNumber,
        body: 'Thank you for submitting your pull request! we soon going to upload your data to MITRE test instance'
    })
}

main()