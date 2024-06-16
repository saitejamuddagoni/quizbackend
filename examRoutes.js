

const express = require('express');
const router  = express.Router();


const getUserPurchases = require('../controllers/exams/YourTestController');
const getAllExamNames = require('../controllers/exams/examsController');
const getSubjectsByExamName  = require('../controllers/exams/subjectsController');
const getTopicsByExamAndSubject = require('../controllers/exams/topicsController');
const getMockTestsByExamSubjectAndChapter = require('../controllers/exams/getMockTestsForView');
const getMockTestById = require('../controllers/exams/getMockTestForTest');
const purchaseMockTest = require('../controllers/exams/purchaseMockTest');
const testSubmit = require('../controllers/exams/testSubmit');

//upto chapter routes
router.get( '/', getAllExamNames);//common to all
router.post('/yourtests', getUserPurchases)
router.post('/subjects',  getSubjectsByExamName)
router.post('/topics',  getTopicsByExamAndSubject)
router.post('/mock-tests-details', getMockTestsByExamSubjectAndChapter)
router.post('/mock-test-get', getMockTestById)
router.post('/mock-test-submit', testSubmit)
router.post('/purchase-test', purchaseMockTest )

module.exports = router;
