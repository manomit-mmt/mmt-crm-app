'use strict';

    const MasterGroup = require('./db/mongo/schemas').masterGroupSchema,
          ObjectType = require('./db/mongo/schemas').objectTypeSchema,
          FieldType = require('./db/mongo/schemas').fieldTypeSchema;


const bulkInsertGroupName = async () => {
    const config = [
        {
            name: 'Basic information',
            relationalName: 'Basic information',
            parentId: null,
            moduleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f', '5edf317cef9fdb6bdf7f31a0', '5edf317cef9fdb6bdf7f31a1'],
            inModuleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f', '5edf317cef9fdb6bdf7f31a0', '5edf317cef9fdb6bdf7f31a1']
        },
        {
            name: 'Telephone numbers',
            relationalName: 'Basic information-Telephone numbers',
            parentId: null,
            moduleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f'],
            inModuleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f']
        }
    ];
    await MasterGroup.insertMany(config);
    console.log("Group inserted successfully");
};


const bulkInsertObjectTypes = async () => {
    const config = [
        {
            name: 'Contact',
        },
        {
            name: 'Company',
        },
        {
            name: 'Deal',
        },
        {
            name: 'Ticket',
        }
    ];
    await ObjectType.insertMany(config);
    console.log("Object Types inserted successfully");
}

const bulkInsertFieldTypes = async () => {
    const config = [
        {
            name: 'sinle-line-text', value: 'Sinle Line Text', settings: {type: 'text'} 
        },
        {
            name: 'multi-line-text', value: 'Multi Line Text', settings: {type: 'textarea'}
        },
        {
            name: 'single-checkbox', value: 'Single Checkbox', settings: { type: 'single-checkbox' }
        },
        {
            name: 'multiple-checkbox', value: 'Multiple Checkbox', settings: { type: 'multiple-checkbox' }
        },
        {
            name: 'dropdown-select', value: 'Dropdown Select',settings: { type: 'dropdown-select' }
        },
        {
            name: 'radio-select', value: 'Radio Select', settings: { type: 'radio-select' }
        },
        {
            name: 'date-picker', value: 'Date Picker', settings: { type: 'date-picker' } 
        },
        {
            name: 'number', value: 'Number', settings: { type: 'number' }
        },
        {
            name: 'calculation', value: 'Calculation', settings: { type: 'calculation' } 
        },
        {
            name: 'score', value: 'Score', settings: { type: 'score' }
        },
        {
            name: 'file', value: 'File', settings: { type: 'file' } 
        },
        {
            name: 'magicmind-user', value: 'Magicmind User', settings: { type: 'magicmind-user' }
        }
    ];

    await FieldType.insertMany(config);
    console.log("Field Types inserted successfully");
}
const entryPoint = () => {
    // bulkInsertObjectTypes()
    // bulkInsertFieldTypes()
};

module.exports = entryPoint;