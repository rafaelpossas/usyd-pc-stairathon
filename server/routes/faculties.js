/**
 * Created by rafaelpossas on 2/09/15.
 */
var express = require('express');
var router = express.Router();
var faculties = require('../controllers/faculties')
/* GET users listing. */

router.get('/',faculties.getFaculties);
router.post('/',faculties.saveFaculty)
router.delete('/:id',faculties.removeFaculty);

module.exports = router;
