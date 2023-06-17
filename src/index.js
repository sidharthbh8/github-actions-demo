const core = require('@actions/core')
const github = require('@actions/github')

const filePath = core.getInput('file_path', { required: true})
const prNumber = core.getInput('pr_number', { required: true})
const token = core.getInput('token', { required: true})

const octokit = new github.getOctokit(token)
const { owner, repo } = github.context.payload
console.log(github.context.payload);

const fileData = octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });