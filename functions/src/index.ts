import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as moment from 'moment';


// ------------------ INIT FIRESTORE ------------------ //

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });
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
		const logs: any = [];
		const querySnapshot = await logsRef.get();
		const documents = querySnapshot.docs;
		documents.forEach(l => {
			const log = l.data();
			logs.push(log);
		});
		response.status(200).json({ logs });
	});
});

/**
 * Get the list of logs
 */
exports.createLog = functions.https.onRequest(async (request, response) => {
	corsHandler(request, response, async () => {
        const name = request.query.name;
        const type = request.query.type;
        const date = request.query.date;
        logsRef.add({name, type, date}).then(snapshot => {
            response.status(200).json({ name, type, date });
        }).catch(e => response.status(400).json({ error: 'error' }));
	});
});
