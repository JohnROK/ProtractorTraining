/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                     09/01/2016       John Armstrong           Initial Version
 *                     09/14/2016       John Armstrong           Added waitForState & getStepState
 *                     09/21/2016       John Armstrong           Added timeout to waitForState
 *                     9/22/2016        John Armstrong           Expanded waitForState to not only wait
 *                                                               for batch States, but also batch Modes
 *
 * Description: This module contains Batch Server APIs
 *
 */
(function () {
    "use strict";
    var socket = require('./BatchServerInterface.js')().getSocket(),
    events = require('events'),
    eventEmitter = new events.EventEmitter(),
    eventUpdate = null;

    module.exports = {
        getCreateId: function (targetBatchId) {
            return new Promise(function (resolve, reject) {
                socket.on('ft.batch.subscribe.batchlist', function (data) {
                    var batchList = JSON.parse(data);
                    var keys = Object.keys(batchList);
                    var batch;
                    for (var i = 0; i < keys.length; i++) {
                        batch = batchList[keys[i]];
                        if (batch.batchid === null) {
                            reject('Error retrieving createID for ' + targetBatchId);
                        }
                        if (targetBatchId === batch.batchid) {
                            resolve(batch.id);
                        }
                    }
                });
                socket.on('ft.batch.update.batchlist', function (data) {
                    var batchList = JSON.parse(data);
                    var keys = Object.keys(batchList);
                    var batch;
                    for (var i = 0; i < keys.length; i++) {
                        batch = batchList[keys[i]];
                        if (batch) {
                            if (targetBatchId === batch.batchid) {
                                resolve(batch.id);
                            }
                        }
                    }
                });
                socket.emit('ft.batch.subscribe', JSON.stringify(['batchlist']));
            });
        },
        getBatchListCount: function () {
            socket.on('ft.batch.subscribe.batchlistct', function (data) {
                var x = JSON.parse(data);
                console.log('This is what is returned from subscribe= ' + x.count);
            });
            socket.on('ft.batch.update.batchlistct', function (data) {
                var x = JSON.parse(data);
                console.log('This is what is returned from update= ' + x.count);
            });
            socket.emit('ft.batch.subscribe', JSON.stringify(['batchlistct']));
        },
        addBatch: function (recipeData) {
            return new Promise(function (resolve, reject) {
                var execute = {
                    type: 'protractor',
                    typeObj: {
                        name: 'BATCH',
                        data: recipeData
                    }
                };
                socket.on('ft.batch.execute.protractor', function (data) {
                    var response = JSON.parse(data);
                    if ('0' === response.status) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
                socket.emit('ft.batch.execute', JSON.stringify(execute));
            });

        },
        waitForState: function (createID, targetStep, targetState, maxTimeToWait) {
            return new Promise(function (resolve, reject) {
                var myTimer = setTimeout(timeoutReached, maxTimeToWait);

                getStepState(createID, targetStep, targetState);
                if (eventUpdate === null) {
                    eventUpdate = function (state) {
                        if (state === targetState) {
                            clearTimeout(myTimer);
                            console.log(targetStep + ': changed to ' + state);
                            listenerCleanUp(createID);
                            eventUpdate = null;
                            resolve();
                        }
                    };
                    eventEmitter.on('update', eventUpdate);
                }

                function timeoutReached(){
                    listenerCleanUp(createID);
                    clearTimeout(myTimer);
                    eventUpdate = null;
                    reject('Timed out waiting for ' + targetStep + ' to change to ' + targetState);
                }
            });
        }
    };

    function getStepState(createID, targetStep, targetState) {
        var stepKey,
            stepValue = 'state';
        if('MANUAL' === targetState || 'S_AUTO' === targetState || 'O_AUTO' === targetState){
            stepValue = 'mode';
        }

        socket.on('ft.batch.subscribe.proceduresummary.' + createID, function (data) {
            var details = JSON.parse(data);
            var keys = Object.keys(details);
            var step;
            for (var i = 0; i < keys.length; i++) {
                step = details[keys[i]];
                //console.log('SUBSCRIBE: modes are ' + step.name + ' : ' + step.mode);
                if (step.name === targetStep) {
                    if (step[stepValue] === targetState) {
                        eventEmitter.emit('update', step[stepValue]);
                    }
                    stepKey = keys[i];
                    //console.log('XXXXXXXXXXXXXXXXXXXXX      FROM SUBSCRIBE key I WANT is = ' + stepKey);
                }
            }
        });

        socket.on('ft.batch.update.proceduresummary.' + createID, function (data) {
            var details = JSON.parse(data);
            var keys = Object.keys(details);
            var step;
            for (var i = 0; i < keys.length; i++) {
                step = details[keys[i]];
                //console.log('UPDATE: modes are ' + step.name + ' : ' + step.mode);
                if (step.name === targetStep) {
                    //console.log('UPDATE: STEPNAME = TARGETSTEP' + step.name + '=? ' +targetStep);
                    stepKey = keys[i];
                }
                if (keys[i] === stepKey) {
                    //console.log('UPDATE: keys[i] = stepKey' + keys[i] + '=? ' +stepKey + step.name + ':' + step.mode);
                    eventEmitter.emit('update', step[stepValue]);
                }
            }
        });

        var itemData = {
            name: 'proceduresummary',
            createid: createID
        };
        socket.emit('ft.batch.subscribe', JSON.stringify([itemData]))
    }

    function listenerCleanUp(createID){
        socket.off('ft.batch.subscribe.proceduresummary.' + createID);
        socket.off('ft.batch.update.proceduresummary.' + createID);
        eventEmitter.removeListener('update', eventUpdate);
    }
})();