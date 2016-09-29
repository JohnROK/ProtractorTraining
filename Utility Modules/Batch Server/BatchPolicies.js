/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     09/12/2016       John Armstrong           Initial Version
 *                     09/28/2016       John Armstrong           Mobility build on 9/27/2016 broke getConfirmMask() due to
 *                                                               changing the mask from a decoded object into a JWT. This is
 *                                                               now resolved by implementing the new socket.emit(decodetoken)
 *
 *
 * Description: This module will retrieve the Batch Server user policies
 *
 */
(function () {
    "use strict";
    var socket = require('./BatchServerInterface.js')().getSocket();

    module.exports = {
        getConfirmMask: function () {
            return new Promise(function (resolve, reject) {
                socket.on('ft.batch.execute.decodetoken', function(data){
                    var res = JSON.parse(data);
                    if (0 === res.authorize.confirm) {
                        resolve(false);
                    }
                    else if (1 === res.authorize.confirm) {
                        resolve(true);
                    }
                    else {
                        reject('Error determining Batch command confirmation policy');
                    }
                });

                socket.on('ft.batch.execute.checkauthorization', function (data) {
                    var res = JSON.parse(data),
                        typeObj = {
                            token: res.userToken
                        };
                    var executeInfo = {
                        type: 'decodetoken',
                        typeObj: typeObj
                    };
                    socket.emit('ft.batch.execute', JSON.stringify(executeInfo));
                });

                var executeInfo = {
                    type: 'checkauthorization',
                    typeObj: {}
                };
                socket.emit('ft.batch.execute', JSON.stringify(executeInfo));
            });
        }
    };
})();