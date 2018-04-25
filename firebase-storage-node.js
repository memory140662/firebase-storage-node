const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const processBar = require('./libs/processBar');
require('./libs');

module.exports = async (app, filePath, metadata) => {
    const timer = processBar();
    timer.start();
    try {
        const storageRef = app.storage().ref().child(path.basename(filePath));
        const data = fs.readFileSync(filePath);
        const snapshot = await storageRef.put(data, metadata);
        const { state } = snapshot;
        timer.finish();
        console.log(`Upload finished.(status: ${state})`);
        if (state === 'success') {
            const { downloadURLs } = snapshot.metadata;
            console.log('Urls:', _.get(downloadURLs, 0));
        }
        return snapshot;
    } catch (e) {
        timer.finish();
        throw new Error(e);
    }
}