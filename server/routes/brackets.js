/**
 * Created by rafaelpossas on 2/09/15.
 */
var express = require('express');
var router = express.Router();
var brackets = require('../controllers/brackets')
/* GET users listing. */

router.post('/',brackets.saveBracket);
router.get('/',brackets.getBrackets);
router.get('/',brackets.getBracket);
router.get('/:id/result',brackets.getBracketResults);
router.delete('/:id',brackets.removeBracket);

module.exports = router;
