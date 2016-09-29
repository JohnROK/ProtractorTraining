/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                      09/29/2016      John Armstrong           Initial Version
 *
 *
 * Description: This test is used for the Protractor training course
 */
(function () {
    "use strict";
    var utilModules = './../../../Utility Modules/',
        navigate = require(utilModules + 'Site Navigation/Navigate'),
        selectBatch = require(utilModules + 'Batches Page/SelectBatch'),
        SFC = require(utilModules + 'Batches Page/Detail-View'),
        commandButton = require(utilModules + 'Batches Page/ActionBarButtons'),
        batchSvrAPI = require(utilModules + 'Batch Server/BatchServerAPI'),
        equipmentPage = require(utilModules + 'Equipment Page/Equipment'),
        createId1;

    describe('01_Example_Test Setup', function () {
        it('Add batch FrenchVanilla to the batch list', function (done) {
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_BATCH,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,' +
                'PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750')
                .then(function () {
                    return batchSvrAPI.getCreateId('VANILLA_BATCH')
                })
                .then(function (res) {
                    createId1 = res;
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });
    });

    //Wait for the 'About Page' to load.
    browser.driver.wait(protractor.until.elementLocated(by.id('pageAbout')), 20000);

    describe('Testing state commands Start, Hold, Restart, and Stop at the BPC recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_BATCH');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(createId1, 'VANILLA_BATCH', 'RUNNING', 20000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the correct state commands are visible at the Batch Procedure level', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    return commandButton.isVisible('start', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', true)
                })
                .then(function () {
                    return commandButton.isVisible('stop', true)
                })
                .then(function () {
                    return commandButton.isVisible('abort', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill down to the Unit Operation level', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    return SFC.drillIntoStep('CLS_SWEETCREAM_OP:1')
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(error);
                    done();
                });
        });

        it('Place the Unit Operation into Semi-Auto mode', function (done) {
            commandButton.clickMenuButton('semi-auto')
                .then(function () {
                    return batchSvrAPI.waitForState(createId1, 'CLS_SWEETCREAM_OP:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the Unit Operation into the HELD state', function (done) {
            commandButton.clickMenuButton('hold')
                .then(function () {
                    return batchSvrAPI.waitForState(createId1, 'CLS_SWEETCREAM_OP:1', 'HELD', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the state has updated on the Equipment page', function (done) {
            navigate.toPage('equipment')
                .then(function () {
                    return equipmentPage.getEquipmentData()
                })
                .then(function (data) {
                    return expect(data.WP_ADD_EGG_M1.state).toBe('HELD')
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return to the Batches page and command the batch into Auto mode', function (done) {
            navigate.toPage('batches')
                .then(function () {
                    return selectBatch.byName('VANILLA_BATCH');
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the batch into Auto mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function(){
                    return batchSvrAPI.waitForState(createId1, 'VANILLA_BATCH', 'O_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the batch to ABORT', function (done) {
            commandButton.clickMenuButton('abort')
                .then(function(){
                    return batchSvrAPI.waitForState(createId1, 'VANILLA_BATCH', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove the batch from the batch list', function (done) {
            commandButton.clickMenuButton('remove')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

    });
})();