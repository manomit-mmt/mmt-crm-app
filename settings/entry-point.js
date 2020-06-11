'use strict';

const ModuleMaster = require('./db/mongo/schemas').moduleSchema,
      MasterGroup = require('./db/mongo/schemas').masterGroupSchema,
      MasterField = require('./db/mongo/schemas').masterFieldSchema;


const bulkInsertModuleName = async () => {

    const config = [
        {
            name: 'lead',
            pluralName: 'leads',
            slug: 'lead',
            moduleType: 'CRM Customization'
        },
        {
            name: 'contact',
            pluralName: 'contacts',
            slug: 'contact',
            moduleType: 'CRM Customization'
        },
        {
            name: 'account',
            pluralName: 'accounts',
            slug: 'account',
            moduleType: 'CRM Customization'
        },
        {
            name: 'deal',
            pluralName: 'deals',
            slug: 'deal',
            moduleType: 'CRM Customization'
        }
    ];
    await ModuleMaster.insertMany(config);
    console.log("Modules inserted successfully");
};

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

const bulkInsertProperty = async () => {
    const config = [
        {
            fieldLabel: 'First name',
            internalName: 'first_name',
            fieldType: 'Text field',
            tooltip: 'Enter first name',
            placeholderText: 'Enter first name',
            groupId: '5edf35ad9633824fef4e750c',
            isRequired: true,
            isUnique: false,
            moduleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f', '5edf317cef9fdb6bdf7f31a0', '5edf317cef9fdb6bdf7f31a1'],
            inModuleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f', '5edf317cef9fdb6bdf7f31a0', '5edf317cef9fdb6bdf7f31a1']
        },
        {
            fieldLabel: 'Last name',
            internalName: 'last_name',
            fieldType: 'Text field',
            tooltip: 'Enter last name',
            placeholderText: 'Enter last name',
            groupId: '5edf35ad9633824fef4e750c',
            isRequired: true,
            isUnique: false,
            moduleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f', '5edf317cef9fdb6bdf7f31a0', '5edf317cef9fdb6bdf7f31a1'],
            inModuleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f', '5edf317cef9fdb6bdf7f31a0', '5edf317cef9fdb6bdf7f31a1']
        },
        {
            fieldLabel: 'Email',
            internalName: 'email',
            fieldType: 'Text field',
            tooltip: 'Enter email',
            placeholderText: 'Enter email',
            groupId: '5edf35ad9633824fef4e750c',
            isRequired: true,
            isUnique: true,
            moduleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f'],
            inModuleId: ['5edf317cef9fdb6bdf7f319e', '5edf317cef9fdb6bdf7f319f']
        }
    ];

    await MasterField.insertMany(config);
    console.log("Property added successfully");
};
const entryPoint = () => {
    // bulkInsertModuleName()
    // bulkInsertGroupName();
    // bulkInsertProperty();
};

module.exports = entryPoint;