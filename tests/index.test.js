const core = require('@actions/core');
const { sendVulnerabilities} = require('../src/sendCveTest');
require('../src/index');

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

jest.mock('../src/sendCveTest', () => ({
    sendVulnerabilities: jest.fn(),
    fileContent: 'file content',
}));

describe('Main Function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful execution with valid description', async () => {
        
        sendVulnerabilities.mockImplementation((idNumber, callback) => {
            callback('Upload successful');
        });
        expect(core.getInput).toHaveBeenCalledWith('pr_number', { required: true });
        expect(core.getInput).toHaveBeenCalledWith('token', { required: true });
    });
    
});