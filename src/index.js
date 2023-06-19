const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs');
const reserveCveId = require('./reserveId')


const main = async () => {
    try {
    const filePath = core.getInput('file_path', { required: true })
    const prNumber = core.getInput('pr_number', { required: true })
    const token = core.getInput('token', { required: true })
    // const personalToken = core.getInput('personal_token', { required: true})
    let check

    const octokit = new github.getOctokit(token);

    // console.log(github.context.payload);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        core.setOutput('file_content', fileContent)
        // console.log(fileContent);
        if (fileContent===null){
            check = false
            return;
        }
        check = true
    } catch (e) {
        core.setFailed(e.message)
    }

    const context = github.context

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

    reserveCveId(check, 1, async(idNumber) => {
        try {
            await octokit.rest.issues.createComment({
                ...context.repo,
                issue_number: prNumber,
                body: `Here is your reserved CVE ID ${idNumber} to upload the cve to MITRE test instance`
            })
        } catch (e) {
            core.setOutput(e.message)
        }
    })

    // const comment = await octokit.rest.issues.get({
    //     ...context.repo,
    //     issue_number: prNumber,
    //   });
    //   console.log(comment);

    } catch (e) {
        core.setFailed(e.message)        
    }
}

main()