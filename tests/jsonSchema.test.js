const cveStructureValidator = require('../src/validator//validate');
const invalidJson = require('./test_CVEs/invalid_CVE.json')
const advanceValidJson = require('./test_CVEs/advance_valid_CVE.json')
const basicValidJson = require('./test_CVEs/basic_valid_CVE.json')

describe('CVE Structure Validator', () => {
    it('should validate a basic minimum required valid JSON structure', async () => {
        const validData = basicValidJson

        await cveStructureValidator(JSON.stringify(validData), (error, result) => {
            expect(error).toBe(undefined);
            expect(result).toBe('JSON validated, CVE data is in specified structure and contains all the necessary');
        });
    });

    it('should validate a advance valid JSON structure', async () => {
        const validData = advanceValidJson

        await cveStructureValidator(JSON.stringify(validData), (error, result) => {
            expect(error).toBe(undefined);
            expect(result).toBe('JSON validated, CVE data is in specified structure and contains all the necessary');
        });
    });

    it('should report errors for invalid JSON structure', async () => {
        const invalidData = invalidJson

        await cveStructureValidator(JSON.stringify(invalidData), (error, result) => {
            expect(error).toContain('Invalid');
            expect(result).toBe(undefined);
        });
    });

    it('should handle undefined file content', async () => {

        await cveStructureValidator(undefined, (error, result) => {
            expect(error).toBe('Can not read the CVE JSON file');
            expect(result).toBe(undefined);
        });
    });

    it('should handle JSON parsing error', async () => {
        const invalidJson = 'invalid_json';

        const originalJSONParse = JSON.parse;
        JSON.parse = jest.fn().mockImplementation(() => {
        });

        await cveStructureValidator(invalidJson, (error, result) => {
            expect(error).toMatch(/invalid/i)
            expect(result).toBe(undefined);
        });

        JSON.parse = originalJSONParse;
    });

    it('should handle validation failure', async () => {
        const invalidData = invalidJson

        JSON.parse = jest.fn().mockReturnValue(invalidData);

        await cveStructureValidator(JSON.stringify(invalidData), (error, result) => {
            expect(error).toContain('Invalid');
            expect(result).toBe(undefined);
        });

        JSON.parse.mockRestore();
    });
});
