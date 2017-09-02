exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
exports.notFound = (req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
};

exports.flashValidationErrors = (err, req, res, next) => {
  if (err.status) return next(err);
  if (!err.errors) return res.redirect('back');
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash('error', err.errors[key].message));
  res.redirect('back');
};

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
    name: 'error'
  };
  res.status(err.status || 500);
  res.format({
    'text/html': () => {
      res.render('error', errorDetails);
    }, 
    'application/json': () => res.json(errorDetails) 
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    name: 'error'
  });
};
