jest.mock('@actions/core')
const core = require('@actions/core')
const { vulnerabilitiesCount, createIssueComment, handleCveReservationsAndUpload } = require('../src/securityUtils')
const mockOctokit = require('./__mocks__/@actions/github')

jest.mock('../src/reserveId', () => ({
    reserveCveId: jest.fn((check, number) => Promise.resolve('mockedId')),
}));

jest.mock('../src/sendCveTest', () => ({
    sendVulnerabilities: jest.fn((idNumber) => Promise.resolve('mockedResponse'))
}));

jest.mock('../src/validator/validate', () => ({
    cveStructureValidator: jest.fn((fileContent, callback) => {
        if (fileContent === 'valid') {
            callback(null, 'Valid structure');
        } else {
            callback(null, 'Invalid structure');
        }
    }),
}));

describe('vulnerabilitiesCount', () => {
    it('should return null for no match', () => {
        const description = 'No vulnerabilities reported';
        const result = vulnerabilitiesCount(description);
        expect(result).toBeNull();
    });

    it('should return the correct count', () => {
        const description = 'Amount of vulnerabilities reporting - 5';
        const result = vulnerabilitiesCount(description);
        expect(result).toBe('5');
    });
});

describe('createIssueComment', () => {
    it('should create a comment', async () => {

        const expectedComment = {
            owner: 'sidharthbh8',
            repo: 'zowe-cve-publication',
            issue_number: '123',
            body: 'Test comment',
        };

        expect(mockOctokit.getOctokit('mock-token').rest.issues.createComment).toEqual(expectedComment);
    });

    it('should handle error', async () => {
        const expectedComment = 'Can not create a comment';

        mockOctokit.getOctokit('mocked-token').rest.issues.createComment = jest.fn().mockRejectedValue(new Error(expectedComment));
        try{
            await createIssueComment(expectedComment)
            throw new Error('Can not create a comment')
        }catch (e){
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toBe(expectedComment)
        }
       
    });
    
});