import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';


// ------------------ INIT FIRESTORE ------------------ //

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// -------------------- HANDLE CORS ------------------- //

const corsHandler = cors({ origin: true });

// --------------------- GLOBALS ---------------------- //

const logsRef = db.collection('logs');

// ---------------------- ROUTES ---------------------- //

/**
 * Get the list of logs
 */
exports.getLogs = functions.https.onRequest(async (request, response) => {
	corsHandler(request, response, async () => {
        try {
            const logs: any = [];
            const querySnapshot = await logsRef.get();
            const documents = querySnapshot.docs;
            documents.forEach(l => {
                const log = l.data();
                logs.push(log);
            });
            response.status(200).send(logs);
        } catch(error) {
            response.status(500).send({ error });
        }

	});
});

/**
 * Create Log
 */
exports.createLog = functions.https.onRequest((request, response) => {
	corsHandler(request, response, async () => {
        try {
            const name = request.body.name;
            const type = request.body.type;
            const date = request.body.date;
            await logsRef.add({name, type, date});
            response.status(200).send({ name, type, date });
        } catch(error) {
            response.status(400).send({ error });
        }
	});
});
