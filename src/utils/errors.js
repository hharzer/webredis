function NotFound(message = 'Not Found') {
  return {
    message,
    status: 404,
  };
}

function BadRequest(message = 'Bad Request') {
  return {
    message,
    status: 400,
  };
}

module.exports = {
  NotFound,
  BadRequest,
};
