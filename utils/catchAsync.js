// Using the Asycn erron function to handle the errors
module.exports = fn => {
    return (req, res, next) => {
fn(req, res, next).catch(next);
    //   Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  