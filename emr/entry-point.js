'use strict';

const TreatmentType = require('./db/mongo/schemas').treatmentTypeSchema;

const insertTreatmentType = async () => {
    const config = [
        {
            name: 'Allergy'
        },
        {
            name: 'Diabetes'
        },
        {
            name: 'CBS'
        },
        {
            name: 'Thyroid'
        },
        {
            name: 'Hypertension'
        },
        {
            name: 'Viral Infection'
        },
        {
            name: 'Fever'
        }
    ];
    await TreatmentType.create(config);
    console.log("Task types inserted successfully")
}

const entryPoint = () => {
    insertTreatmentType();
};

module.exports = entryPoint;