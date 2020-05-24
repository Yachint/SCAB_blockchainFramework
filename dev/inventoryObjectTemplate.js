
const AdditionalInfo = {
    name: null,
    designation: null,
    companyAddress: null,
    warehouseAddress: null,
    productCategories: [],
    pubKey: null
}

const Inventory = {
    isLoaded: false,
    currentHash: null,
    inventory: [],
    scabLedger: [],
    changedState: {}
}

const stats = {
    txNumber: 0,
    moneySpent: 0,
    moneyEarned: 0,
    bankHistory: []
}

exports.AdditionalInfo = AdditionalInfo;
exports.Inventory = Inventory;
exports.stats = stats;