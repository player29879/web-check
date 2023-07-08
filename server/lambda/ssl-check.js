const https = require('https');

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;

  const errorResponse = (message, statusCode = 444) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: message }),
    };
  };

  if (!url) {
    return errorResponse('url query parameter is required');
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, res => {

      // Check if the SSL handshake was authorized
      if (!res.socket.authorized) {
        resolve(errorResponse(`SSL handshake not authorized. Reason: ${res.socket.authorizationError}`));
      } else {
        let cert = res.socket.getPeerCertificate(true);
        if (!cert || Object.keys(cert).length === 0) {
          resolve(errorResponse("No certificate presented by the server."));
        } else {
          // omit the raw and issuerCertificate fields
          const { raw, issuerCertificate, ...certWithoutRaw } = cert;
          resolve({
            statusCode: 200,
            body: JSON.stringify(certWithoutRaw),
          });
        }
      }
    });

    req.on('error', (error) => {
      resolve(errorResponse(`Error fetching site certificate: ${error.message}`, 500));
    });

    req.end();
  });
};
