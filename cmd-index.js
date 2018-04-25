const firebase = require('firebase');
const yargs = require('yargs');
const path = require('path');
const _ = require('lodash');
const config = require('./config');

const firebaseStorage = require('./firebase-storage-node');

const app = firebase.initializeApp(config);

const args = yargs.options({
    'f': {
        alias: 'file',
        demandOption: true,
        describe: '指定檔案路徑及名稱，例如：-f "./aa/bb.xx"、 -f "C:/a/b/c.xx"',
    },
    'm': {
        alias: 'metadata',
        demandOption: false,
        describe: '上傳檔案之類型，請參照 Firebase UploadMetadata API 設定。'
            + '\nhttps://firebase.google.com/docs/reference/js/firebase.storage.UploadMetadata'
            + '\n\n 例如：-m cacheControl=xxx -m contentDisposition="cccc"',
        type: 'array',
    }
})
    .version(false)
    .help()
    .alias('h', 'help')
    .argv;

const filePath = path.resolve(args.file);
const metadata = {};

if (_.isArray(args.metadata)) {
    _.each(args.metadata, value => {
        const m = _.split(value, '=');
        metadata[m[0]] = m[1];
    });
}

app.auth().signInAnonymously().then(err => {
    if (err.code) {
        console.log('\n', {
            errorCode: err.code,
            errorMessage: err.message
        });
    }
});

app.auth().onAuthStateChanged(async user => {
    try {
        if (user) {
            const { uid, isAnonymous } = user;
            if (isAnonymous) {
                await firebaseStorage(app, filePath, metadata);
            }
            process.exit(0);
        }
    } catch (e) {
        console.error({ error: e });
        process.exit(1);
    }
});