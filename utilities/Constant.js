
const statusCodes = {
    success: 200,
    conflict: 409,
    internalServerError: 500,
    badReq: 400,
    invalidToke: 403,
    Unauthorized: 401,

};

const errStatusCode = {
    'ER_DUP_ENTRY': 409,
    'ER_NO_REFERENCED_ROW': 400,
    'ER_BAD_NULL_ERROR': 400,
    'ER_INVALID_PARAMETER': 400,
    'ER_ACCESS_DENIED_ERROR': 401,
    'ER_TOKEN_INVALID': 403,
    'ER_NOT_FOUND': 404,
    'ER_METHOD_NOT_ALLOWED': 405,
    'ER_NOT_ACCEPTABLE': 406,
    'ER_REQUEST_TIMEOUT': 408,
    'ER_REQUEST_ENTITY_TOO_LARGE': 413,
    'ER_INTERNAL_SERVER_ERROR': 500,
    'ER_NOT_IMPLEMENTED': 501,
    'ER_BAD_GATEWAY': 502,
    'ER_SERVICE_UNAVAILABLE': 503,
    'ER_HTTP_VERSION_NOT_SUPPORTED': 505,
    'ER_NETWORK_AUTHENTICATION_REQUIRED': 598,
    'ER_NETWORK_CONNECT_TIMEOUT_ERROR': 599,
}

const errMessage = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Invalid Token',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    408: 'Request Timeout',
    409: 'Conflict',
    413: 'Payload Too Large',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    505: 'HTTP Version Not Supported',
    598: 'Network Authentication Required',
    599: 'Network Connect Timeout Error',
};


let Constant = {
    handleSuccess: (res, data, message) => {
        const response = { status: statusCodes.success, message: message, data: data };
        res.json(response)
    },
    handleBadReq: (res, data, message) => {
        const response = { status: statusCodes.badReq, message: message, data: data };
        res.status(statusCodes.badReq).json(response)
    },
    handleAuthToken: (res, code, message) => {
        const response = { status: code, message: message, };
        res.status(code).json(response)
    },
    catchMiddleWareError: (res, err) => {
        let statusCode = 500
        let errorMessage = 'Internal Server Error';

        if (err.code && errStatusCode.hasOwnProperty(err.code)) { statusCode = errStatusCode[err.code]; }
        else { statusCode = err.statusCode || 500; }

        if (errMessage[statusCode]) {
            errorMessage = errMessage[statusCode]
        } else { errorMessage = 'Internal Server Error'; }

        const responseBody = {
            erorr: { status: statusCode, message: errorMessage, error: err.message, }
        }
        res.status(statusCode).json(responseBody)

    }
}

module.exports = Constant 