'use strict';

const RoleDB = require('./db/mongo/schemas').roleSchema;

const insertRole = async () => {
    const config = [
        {
            name: 'Administrator',
            code: 'ADMIN'
        },
        {
            name: 'Account Manager',
            code: 'ACCOUNT_MANAGER'
        },
        {
            name: 'Sales Executives',
            code: 'SALES_EXECUTIVES'
        }
    ];
    await RoleDB.create(config);
    console.log("Role inserted successfully")
}

const entryPoint = () => {
    insertRole();
};

module.exports = entryPoint;