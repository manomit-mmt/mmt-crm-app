'use strict';

const TaskTypeDB = require('./db/mongo/schemas').taskTypeSchema;

const insertTaskTypes = async () => {
    const config = [
        {
            name: 'Type1'
        },
        {
            name: 'Type2'
        },
        {
            name: 'Type3'
        }
    ];
    await TaskTypeDB.create(config);
    console.log("Task types inserted successfully")
}

const entryPoint = () => {
    insertTaskTypes();
};

module.exports = entryPoint;