import config from '../config/config'

var serviceAccount = require("../../credentials.json")

var admin = require("firebase-admin")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.firestore.storageBucket
});

const bucket = admin.storage().bucket();
module.exports = bucket;

export default bucket;
