const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");

const account = require("./utils/account");
admin.initializeApp({
  credential: admin.credential.cert({
    type: account.type,
    project_id: account.project_id,
    private_key_id: account.private_key_id,
    private_key: account.private_key,
    client_email: account.client_email,
    client_id: account.client_id,
    auth_uri: account.auth_uri,
    token_uri: account.token_uri,
    auth_provider_x509_cert_url: account.auth_provider_x509_cert_url,
    client_x509_cert_url: account.client_x509_cert_url,
  }),
});
initializeApp({
  apiKey: account.apiKey,
  authDomain: account.authDomain,
  projectId: account.projectId,
  storageBucket: account.storageBucket,
  messagingSenderId: account.messagingSenderId,
  appId: account.appId,
  measurementId: account.measurementId,
});

const createCompany = require("./src/company/create");
const updateCompany = require("./src/company/update");
const deleteCompany = require("./src/company/delete");

const createTip = require("./src/tip/create");
const updateTip = require("./src/tip/update");
const deleteTip = require("./src/tip/delete");

const createNotice = require("./src/notice/create");
const updateNotice = require("./src/notice/update");
const deleteNotice = require("./src/notice/delete");

const createEvent = require("./src/event/create");
const updateEvent = require("./src/event/update");
const deleteEvent = require("./src/event/delete");

const createReservation = require("./src/reservation/create");
const updateReservation = require("./src/reservation/update");
const deleteReservation = require("./src/reservation/delete");

const createManager = require("./src/manager/create");
const updateManager = require("./src/manager/update");
const deleteManager = require("./src/manager/delete");

const createQuestion = require("./src/question/create");
const updateQuestion = require("./src/question/update");
const deleteQuestion = require("./src/question/delete");

const createReview = require("./src/review/create");
const updateReview = require("./src/review/update");
const deleteReview = require("./src/review/delete");

const test1 = require("./src/test/test1");

const schedule = require("./src/schedule");

exports.onCreateCompany = createCompany;
exports.onUpdateCompany = updateCompany;
exports.onDeleteCompany = deleteCompany;

exports.onCreateTip = createTip;
exports.onUpdateTip = updateTip;
exports.onDeleteTip = deleteTip;

exports.onCreateNotice = createNotice;
exports.onUpdateNotice = updateNotice;
exports.onDeleteNotice = deleteNotice;

exports.onCreateEvent = createEvent;
exports.onUpdateEvent = updateEvent;
exports.onDeleteEvent = deleteEvent;

exports.onCreateReservation = createReservation;
exports.onUpdateReservation = updateReservation;
exports.onDeleteReservation = deleteReservation;

exports.onCreateManager = createManager;
exports.onUpdateManager = updateManager;
exports.onDeleteManager = deleteManager;

exports.onCreateQuestion = createQuestion;
exports.onUpdateQuestion = updateQuestion;
exports.onDeleteQuestion = deleteQuestion;

exports.onCreateReview = createReview;
exports.onUpdateReview = updateReview;
exports.onDeleteReview = deleteReview;

exports.changeStatus = schedule;

exports.onTest1 = test1;
