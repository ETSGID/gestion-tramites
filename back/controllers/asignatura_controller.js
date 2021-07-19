const axios = require('axios');

//campos: array de campos a devolver en mayuscula
async function getAsignaturasApiUpmAsObject(planCodigo, campos) {
  if (!campos) {
    campos = [];
  }
  try {
    return await axios.get(
      `https://www.upm.es/wapi_upm/academico/comun/index.upm/v2/plan.json/${planCodigo}/asignaturas`, {
      params: {
        campos: campos.join()
      }
    }
    );
  } catch (error) {
    // no se propaga el error porque puede haber fallos en api upm y esta no es critica
    console.log(error);
    return { data: {} };
  }
};

//campos: array de campos a devolver en mayuscula
async function getAsignaturasApiUpmAsArray(planCodigo, campos) {
  if (!campos) {
    campos = [];
  }
  try {
    asignaturasArray = [];
    asignaturasObject = (await getAsignaturasApiUpmAsObject(planCodigo, campos)).data;
    for (let asignatura in asignaturasObject) {
      asignaturasArray.push(asignaturasObject[asignatura]);
    }
    return { data: asignaturasArray }
  } catch (error) {
    // no se propaga el error porque puede haber fallos en api upm y esta no es critica
    console.log(error);
    return { data: [] };
  }
};



exports.getAsignaturasApiUpmAsObject = getAsignaturasApiUpmAsObject;
exports.getAsignaturasApiUpmAsArray = getAsignaturasApiUpmAsArray;