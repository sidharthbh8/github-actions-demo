const core = require('@actions/core')
const axios = require('axios');
const fs = require('fs');
const sendVulnerabilities = require('../src/sendCveTest').sendVulnerabilities;
const { fileContent } = require('./test_CVEs/basic_valid_CVE.json');

jest.mock('@actions/core', () => ({
    getInput: jest.fn()
        .mockReturnValueOnce('your_api_key')
        .mockReturnValueOnce('your_api_user')
        .mockReturnValueOnce('your_api_org')
        .mockReturnValueOnce('path-to-your-json-file'),
    setOutput: jest.fn(),
    setFailed: jest.fn(),
}));

jest.mock('fs', () => ({
    readFileSync: jest.fn(),
}));

jest.mock('axios');

describe('Send Vulnerabilities', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle null CVE ID', async () => {
        const callbackMock = jest.fn();

        await sendVulnerabilities(null, callbackMock);

        expect(callbackMock).not.toHaveBeenCalled();
    });

    it('should handle file read error', async () => {
        const callbackMock = jest.fn();

        fs.readFileSync.mockImplementationOnce(() => {
            throw new Error('File read error');
        });

        await sendVulnerabilities('CVE-2023-1045', callbackMock);

        expect(callbackMock).not.toHaveBeenCalled();
        expect(fs.readFileSync).toHaveBeenCalledWith(fileContent, 'utf8');
        expect(core.setFailed).toHaveBeenCalledWith('File read error');
    });

    it('should handle API call success', async () => {
        const callbackMock = jest.fn();

        axios.post.mockResolvedValueOnce({ data: { message: 'Upload successful' } });

        await sendVulnerabilities('CVE-2023-1045', callbackMock);

        expect(callbackMock).toHaveBeenCalledWith('Upload successful');
        expect(axios.post).toHaveBeenCalledWith(
            'https://cveawg-test.mitre.org/api/cve/CVE-2023-1045/cna',
            fileContent,
            {
                headers: {
                    'CVE-API-ORG': 'your_api_org',
                    'CVE-API-USER': 'your_api_user',
                    'CVE-API-KEY': 'your_api_key',
                },
                setTimeout: 90000,
            }
        );
    });

    it('should handle API call error', async () => {
        axios.post.mockRejectedValue(new Error('API call error'));

        await sendVulnerabilities('CVE-2023-1045', jest.fn());
        expect(core.setOutput).toHaveBeenCalled();
        expect(core.setOutput.mock.calls[1][0]).toBe(
            'Error: Failed to upload CVE data to MITRE test instance: API call error'
        );
    });

    it('should handle file reading error', async () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File reading error');
        });
    
        await sendVulnerabilities('CVE-2023-1045', jest.fn());
        expect(core.setFailed).toHaveBeenCalledWith('File reading error');
    });
    
    it('should handle successful file reading', async () => {
        const callbackMock = jest.fn();

        fs.readFileSync.mockReturnValueOnce(fileContent);
    
        await sendVulnerabilities('CVE-2023-1045', callbackMock);
    
        expect(callbackMock).not.toHaveBeenCalled();
        expect(fs.readFileSync).toHaveBeenCalledWith(fileContent, 'utf8');
        expect(core.setOutput).toHaveBeenCalledWith('file_content', fileContent);
    });
    
    it('should handle unsuccessful API call', async () => {
        const callbackMock = jest.fn();

        axios.post.mockRejectedValue(new Error('API call error'));
    
        await sendVulnerabilities('CVE-2023-1045', callbackMock);
    
        expect(callbackMock).not.toHaveBeenCalled();
        expect(core.setOutput).toHaveBeenCalledWith(
            'Error: Failed to upload CVE data to MITRE test instance: API call error'
        );
    });
    
    it('should handle file reading error with core setFailed', async () => {
        fs.readFileSync.mockImplementationOnce(() => {
            throw new Error('File read error');
        });
    
        await sendVulnerabilities('CVE-2023-1045', jest.fn());
    
        expect(fs.readFileSync).toHaveBeenCalledWith(fileContent, 'utf8');
        expect(core.setFailed).toHaveBeenCalledWith('File read error');
    });
});
