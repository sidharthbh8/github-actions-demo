const Ajv = require('ajv')
const schema = require('./CVE_Schema/schema.json')

const ajv = new Ajv({ allErrors: true })
const validate = ajv.compile(schema)

const validateCve = async (data) => {
  const isValid = await validate(data)
  if (!isValid) {
    return (validate.errors);
  }
  return;
}

const cveStructureValidator = async (fileContent, callback) => {
  if(fileContent === null){
    callback(`Can not read the CVE JSON file`, undefined)
  }

  try {
    const cveData = JSON.parse(fileContent)
    const invalid = await validateCve(cveData)

    if (invalid) {
      const errorMessages = invalid.map((error) => {
        return `At path ${error.instancePath} ${error.message}`;
      });
    
      const errorMessage = errorMessages.join('\n');
      callback(`Invalid 
      ${errorMessage}`, undefined)
    }
    else {
      callback(undefined, 'JSON validated, CVE data is in specified structure and contains all the necessary');
    }

  } catch (parseError) {
    callback(parseError, undefined);
  }  
}

cveStructureValidator();

module.exports = cveStructureValidator