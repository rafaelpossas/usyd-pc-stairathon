/**
 * Created by rafaelpossas on 5/09/15.
 */
/**
 * Created by rafaelpossas on 2/09/15.
 */
var express = require('express');
var router = express.Router();
var taps = require('../controllers/taps')
/* GET users listing. */

router.get('/',taps.getTaps);
router.post('/',taps.saveTap);
router.get('/user/:uid',taps.getTapsByUser);

module.exports = router;
