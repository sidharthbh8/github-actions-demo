const mockCreateComment = {
    owner: 'sidharthbh8',
    repo: 'zowe-cve-publication',
    issue_number: '123',
    body: 'Test comment',
}
const mockOctokit = {
    rest: {
        issues: {
            createComment: mockCreateComment,
        },
    },
    getOctokit:
        jest.fn().mockReturnValue({
            rest: {
                issues: {
                    createComment: mockCreateComment,
                },
            },
        })
};

module.exports = mockOctokit;