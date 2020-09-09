const https = require('https');
const fs = require('fs');

const mailsTestAlu = ['test.9a1@alumnos.upm.es', 'test.9p4@alumnos.upm.es', 'test.9p5@alumnos.upm.es']
const mailsTestPdi = ['test.9p1@upm.es', 'test.9p5@upm.es']

// El acceso a las APIs no se realiza en local o con usuarios de prueba

exports.getDataApiUpm = (mail, path) => {
    return new Promise(resolve => {
        console.log('ACCESING API: www.upm.es' + path);

        const options = {
            hostname: 'www.upm.es',
            path: path,
            headers: {
                "X-UPMUSR": mail
            },
            cert: fs.readFileSync('certificates/es_upm_etsit_mihorario_cert.pem'),
            key: fs.readFileSync('certificates/es_upm_etsit_mihorario_key.pem'),
            passphrase: process.env.API_PASSPHRASE
        }

        // En desarrollo en local NO se puede acceder a la apiUPM
        if (process.env.DEV == 'true' ) {
            let data;
            if (path === '/sapi_upm/academico/alumnos/index.upm/matricula/ultimoanio.json') {
                data = [
                    {
                        "codigo_plan": "09TT",
                        "nombre_plan": "GRADO EN INGENIERIA DE TECNOLOGIAS Y SERVICIOS DE TELECOMUNICACION",
                        "anio": "2019-20",
                        "periodo": "1",
                        "anulada": "N",
                        "conceptos": [
                            {
                                "nombre": "Créditos en 1a Matrícula",
                                "suma_resta": "S",
                                "cantidad": "66",
                                "importe_unidad": "45.02",
                                "importe_total": "2971.32"
                            }, {
                                "nombre": "Apertura Expediente",
                                "suma_resta": "S",
                                "cantidad": "1",
                                "importe_unidad": "33.65",
                                "importe_total": "33.65"
                            }, {
                                "nombre": "Seguro Escolar",
                                "suma_resta": "S",
                                "cantidad": "1",
                                "importe_unidad": "1.12",
                                "importe_total": "1.12"
                            }, {
                                "nombre": "Becario MEC",
                                "suma_resta": "R",
                                "cantidad": "",
                                "importe_unidad": "",
                                "importe_total": "2971.32"
                            }
                        ]
                    }
                ];
            } else if (path === '/sapi_upm/academico/alumnos/index.upm/matricula.json/09TT/asignaturas') {
                data = {
                    "2019-20": [
                        {
                            "codigo_asignatura": "95000001",
                            "nombre_asignatura": "ALGEBRA",
                            "duracion": "1S",
                            "curso": "1",
                            "creditos": "6"
                        },
                        {
                            "codigo_asignatura": "95000013",
                            "nombre_asignatura": "ELECTROMAGNETISMO",
                            "duracion": "1S",
                            "curso": "2",
                            "creditos": "4.5"
                        },
                        {
                            "codigo_asignatura": "95000020",
                            "nombre_asignatura": "ELECTRONICA ANALOGICA",
                            "duracion": "2S",
                            "curso": "2",
                            "creditos": "3"
                        },
                        {
                            "codigo_asignatura": "95000032",
                            "nombre_asignatura": "ORGANIZACION DE EMPRESAS",
                            "duracion": "2S",
                            "curso": "3",
                            "creditos": "4.5"
                        },
                        // Opt
                        {
                            "codigo_asignatura": "95000092",
                            "nombre_asignatura": "INGENIERIA DE TELECOMUNICACION EN COOPERACION PARA EL DESARROLLO",
                            "duracion": "2S",
                            "curso": "3",
                            "creditos": "4.5"
                        },
                        // Opt
                        {
                            "codigo_asignatura": "95000246",
                            "nombre_asignatura": "INGENIERIA DE LA MUSICA",
                            "duracion": "1S",
                            "curso": "4",
                            "creditos": "3"
                        },
                        // TFG
                        {
                            "codigo_asignatura": "95000082",
                            "nombre_asignatura": "TRABAJO FIN DE GRADO",
                            "duracion": "1S",
                            "curso": "4",
                            "creditos": "12"
                        }
                    ]
                }
            }

            resolve(data);
        } else {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (d) => {
                    data += d;
                });

                res.on('end', () => {
                    data = JSON.parse(data);
                    console.log(JSON.stringify(data));

                    resolve(data);
                });
            });

            req.on('error', (e) => {
                console.error(e);
            });

            req.end();
        }
    });
}

exports.getDataApiProgdoc = (path, mail) => {
    return new Promise(resolve => {
        console.log('ACCESING API: portal.etsit.upm.es/pdi/progdoc/api' + path);

        const options = {
            hostname: 'portal.etsit.upm.es',
            path: '/pdi/progdoc/api' + path
        }
        
        if ((process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'pruebas') && path.startsWith('/profesor')
            && mailsTestPdi.includes(mail)) {
            const regexPrimSem = /^\/profesor\/docencia\/.+@.+\/\d{6}\/1S$/;
            const regexSegSem = /^\/profesor\/docencia\/.+@.+\/\d{6}\/2S$/;
            let data;
            if (regexPrimSem.test(path)) {
                data = {
                    "09TT": {
                        "codigo": "09TT",
                        "nombre": "GRADO EN INGENIERIA DE TECNOLOGIAS Y SERVICIOS DE TELECOMUNICACION",
                        "acronimo": "GITST",
                        "asignaturas": [
                            {
                                "codigo": "95000027",
                                "acronimo": "TINF",
                                "nombre": "TEORIA DE LA INFORMACION"
                            }
                        ]
                    }, "09BA": {
                        "codigo": "09BA",
                        "nombre": "MASTER UNIVERSITARIO EN INGENIERÍA DE REDES Y SERVICIOS TELEMÁTICOS",
                        "acronimo": "MUIRST",
                        "asignaturas": [
                            {
                                "codigo": "93001088",
                                "acronimo": "FBID",
                                "nombre": "FUNDAMENTOS DE BIG DATA"
                            }
                        ]
                    }
                }
            } else if (regexSegSem.test(path)) {
                data = {
                    "09IB": {
                        "codigo": "09IB",
                        "nombre": "GRADO EN INGENIERIA BIOMEDICA",
                        "acronimo": "GIB",
                        "asignaturas": [
                            {
                                "codigo": "95000124",
                                "acronimo": "BBDD",
                                "nombre": "BASES DE DATOS"
                            }
                        ]
                    }, "09AW": {
                        "codigo": "09AW",
                        "nombre": "MASTER UNIVERSITARIO EN CIBERSEGURIDAD",
                        "acronimo": "MUCS",
                        "asignaturas": [
                            {
                                "codigo": "93001011",
                                "acronimo": "GROC",
                                "nombre": "GESTIÓN DE RIESGOS Y OPERACIONES EN CIBERSEGURIDAD"
                            }
                        ]
                    }
                }
            }

            resolve(data);
        } else {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (d) => {
                    data += d;
                });

                res.on('end', () => {
                    data = JSON.parse(data);
                    console.log(JSON.stringify(data));

                    resolve(data);
                });
            });

            req.on('error', (e) => {
                console.error(e);
            });

            req.end();
        }
    });
}
