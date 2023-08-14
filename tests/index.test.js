const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const reserveCveId = require('../src/reserveId');
const { sendVulnerabilities, fileContent } = require('../src/sendCveTest');
const cveStructureValidator = require('../src/validator/validate');

jest.mock('@actions/core', () => ({
    getInput: jest.fn()
        .mockReturnValueOnce('pr_number')
        .mockReturnValueOnce('token'),
    setOutput: jest.fn(),
    setFailed: jest.fn(),
}));

jest.mock('@actions/github', () => ({
    getOctokit: jest.fn().mockReturnValue({
        rest: {
            pulls: {
                listFiles: jest.fn().mockResolvedValue([]),
                get: jest.fn().mockResolvedValue({ data: { body: 'Description with valid format' } }),
            },
            issues: {
                createComment: jest.fn(),
            },
        },
        context: {
            repo: {},
        },
    }),
}));

jest.mock('fs', () => ({
    readFileSync: jest.fn().mockReturnValue('file content'),
}));

jest.mock('../src/reserveId', () => jest.fn());
jest.mock('../src/sendCveTest', () => ({
    sendVulnerabilities: jest.fn(),
    fileContent: 'file content',
}));
jest.mock('../src/validator/validate', () => jest.fn());

const main = require('../src/index');

describe('Main Function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful execution with valid description', async () => {
        reserveCveId.mockImplementation((check, amount, callback) => {
            callback('your-reserved-cve-id');
        });

        sendVulnerabilities.mockImplementation((idNumber, callback) => {
            callback('Upload successful');
        });

        cveStructureValidator.mockImplementation((content, callback) => {
            callback(null, 'Validated structure');
        });
        expect(github.getOctokit).toHaveBeenCalled();
        expect(core.getInput).toHaveBeenCalledWith('pr_number', { required: true });
        expect(core.getInput).toHaveBeenCalledWith('token', { required: true });
    });
    
});