module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var bodyData = {
    services: [
        {
            "link": '/update',
            
        },
        
    ]
  };
  res.render('update', bodyData);
});

module.exports = router;