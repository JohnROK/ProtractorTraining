/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     09/01/2016       John Armstrong           Initial Version
 *
 *
 * Description: This module logs into and authenticates with the FTBatch View Server,
 *              essentially becoming a 'headless' client. Having a headless client
 *              will expose the Batch Server APIs for use.
 *
 */
(function () {
    "use strict";
    var request = require('request');
    var io = require('socket.io-client');
    var self = null;

    module.exports = function() {
        if (self) {
            return self;
        }
        self = {
            socket: null,
            connect : function( host, username, password) {
                return getToken(host, username, password)
                    .then(function(authToken){
                        return authenticateToken(host, authToken);
                    });
            },
            getSocket : function(){return self.socket;}
        };
        function getToken( host, username, password) {
            return new Promise(function(resolve, reject){
                request.post({
                        url: 'https://' + host + '/auth/login?username=' + username + '&password=' + password,
                        rejectUnauthorized: false
                    },
                    function (err, res, body) {
                        if (res) {
                            body = body.toString();
                            body = JSON.parse(body);
                            resolve(body.token);
                        }
                        else if (err) {
                            reject(err);
                        }
                    });
            });
        }

        function authenticateToken(host, token){
            return new Promise(function(resolve, reject) {
                // Create the socket.io connection
                self.socket = io.connect('https://' + host, {rejectUnauthorized: false});

                self.socket.on('connect', function () {
                    self.socket.emit('authenticate', {token: token});
                });
                self.socket.on('authenticated', function () {
                    resolve()
                });
                self.socket.on('connect_error', function (err) {
                    reject(err);
                });
                self.socket.on('disconnect', function () {
                    reject('authenticateToken: socket disconnected by server, ');
                });
            });
        }
        return self;
    };
})();