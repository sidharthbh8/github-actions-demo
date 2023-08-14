const Ajv = require('ajv')
const addformats = require('ajv-formats')
const schema = require('./CVE_Schema/schema.json')

const validateCve = async (data) => {
  const ajv = new Ajv({ allErrors: true })
  addformats(ajv)
  const validate = ajv.compile(schema)
  const isValid = await validate(data)
  if (!isValid) {
    return (validate.errors);
  }
  return;
}

const cveStructureValidator = (fileContent, callback) => {
  if (typeof(fileContent) === 'undefined') {
    return(`Can not read the CVE JSON file`)
  }

  const cveData = JSON.parse(fileContent)
  validateCve(cveData)
    .then((invalid) => {

      if (invalid) {
        const errorMessages = invalid.map((error) => {
          return `At path ${error.instancePath} ${error.message}`;
        });

        const errorMessage = errorMessages.join('\n');
        callback(`Invalid\n ${errorMessage}`, undefined)
      }
      else {
        callback(undefined, 'JSON validated, CVE data is in specified structure and contains all the necessary');
      }
    })
    .catch(parseError => {
      callback(parseError.message, undefined)
    })
}

cveStructureValidator();

module.exports = cveStructureValidator