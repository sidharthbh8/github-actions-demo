const axios = require('axios');
const reserveCveId = require('../src/reserveId');

jest.mock('@actions/core', () => ({
    getInput: jest.fn().mockReturnValueOnce('your_api_key')
        .mockReturnValueOnce('your_api_user')
        .mockReturnValueOnce('your_api_org'),
}));

jest.mock('axios');

describe('CVE ID Reservation', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should reserve a CVE ID', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                cve_ids: [{ cve_id: 'CVE-2023-12345' }],
            },
        });

        const callbackMock = jest.fn();
        await reserveCveId(true, 1, callbackMock);

        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('https://cveawg-test.mitre.org/api/cve-id'), null, {
            headers: {
                'CVE-API-ORG': 'your_api_org',
                'CVE-API-USER': 'your_api_user',
                'CVE-API-KEY': 'your_api_key',
            },
        });

        expect(callbackMock).toHaveBeenCalledWith('CVE-2023-12345');
    });

    it('should handle no data received', async () => {
        const callbackMock = jest.fn();
        const result = await reserveCveId(false, 1, callbackMock);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('No data recieved, send CVE data in order to reserve the CVE ID');
        expect(callbackMock).not.toHaveBeenCalled();
    });

    it('should handle axios.post error', async () => {
        axios.post.mockRejectedValueOnce(new Error('API error'));

        const callbackMock = jest.fn();
        await reserveCveId(true, 1, callbackMock);

        expect(callbackMock).not.toHaveBeenCalled();
    });

    it('should handle axios.post rejection', async () => {
        axios.post.mockRejectedValueOnce(new Error('API error'));

        const callbackMock = jest.fn();
        await reserveCveId(true, 1, callbackMock);

        expect(callbackMock).not.toHaveBeenCalled();
    });

    it('should handle axios.post exception', async () => {
        axios.post.mockImplementationOnce(() => {
            throw new Error('Exception in axios.post');
        });

        const callbackMock = jest.fn();
        await reserveCveId(true, 1, callbackMock);

        expect(callbackMock).not.toHaveBeenCalled();
    });

    it('should handle callback error', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                cve_ids: [{ cve_id: 'CVE-2023-12345' }],
            },
        });

        const callbackMock = jest.fn(() => {
            throw new Error('Callback error');
        });

        await reserveCveId(true, 1, callbackMock);

        expect(callbackMock).toHaveBeenCalledWith('CVE-2023-12345');
    });

    it('should handle invalid type for amount', async () => {
        const callbackMock = jest.fn();

        await reserveCveId(true, 'two', callbackMock);

        expect(callbackMock).not.toHaveBeenCalled();
    });
});
