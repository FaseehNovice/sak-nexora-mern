export function isAuthError(error) {
  return /sign in|expired|not configured|admin access/i.test(error.message);
}

export function adminErrorMessage(error) {
  if (error instanceof TypeError && /fetch/i.test(error.message)) {
    return 'Cannot reach the API. Check that the server is running and MongoDB is connected.';
  }
  if (/Something went wrong on our side/i.test(error.message)) {
    return 'The server could not load this data. Check the API terminal for the underlying database error.';
  }
  return error.message;
}
