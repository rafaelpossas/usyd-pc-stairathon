
var _app = function(){
    global.env = process.env.NODE_ENV || "development";
    global.config = require('./server/config/config')[global.env];
    global.logger = require('morgan');
    var app = require('./server/config/express');
    require('./server/config/mongoose')(global.config.db);

    /*

     // catch 404 and forward to error handler
     app.use(function(req, res, next) {
     var err = new Error('Not Found');
     err.status = 404;
     next(err);
     });

     // error handlers

     // development error handler
     // will print stacktrace
     if (app.get('env') === 'development') {
     app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
     message: err.message,
     error: err
     });
     });
     }

     // production error handler
     // no stacktraces leaked to user
     app.use(function(err, req, res, next) {
     res.status(err.status || 500);
     res.render('error', {
     message: err.message,
     error: {}
     });
     });
     */
    return app
}();



module.exports = _app;
