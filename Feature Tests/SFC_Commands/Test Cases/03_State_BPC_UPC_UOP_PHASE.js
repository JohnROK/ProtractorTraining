/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                      09/21/2016      John Armstrong           Initial Version
 *
 *
 * Description: This test will verify that when a BPC, UPC, UOP, and Phase
 *              is commanded to change its state that the SFC correctly updates,
 *              including state displays and state buttons being enabled/disabled.
 */
(function () {
    "use strict";
    var utilModules = './../../../Utility Modules/',
        navigate = require(utilModules + 'Site Navigation/Navigate'),
        selectBatch = require(utilModules + 'Batches Page/SelectBatch'),
        SFC = require(utilModules + 'Batches Page/Detail-View'),
        commandButton = require(utilModules + 'Batches Page/ActionBarButtons'),
        batchSvrAPI = require(utilModules + 'Batch Server/BatchServerAPI'),
        S1CreateId, S2CreateId, S3CreateId, S4CreateId,
        S5CreateId, S6CreateId, S7CreateId, S8CreateId,
        timerCreateId;

    describe('Test 03_State_BPC_UPC_UOP_PHASE Setup', function () {
        it('Add required batches to the batch list', function (done) {
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES1,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES1').then(
                        function (res) {
                            S1CreateId = res;
                        });
                });
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES2,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES2').then(
                        function (res) {
                            S2CreateId = res;
                        });
                }
            );
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES3,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES3').then(
                        function (res) {
                            S3CreateId = res;
                        });
                }
            );
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES4,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES4').then(
                        function (res) {
                            S4CreateId = res;
                        });
                }
            );
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES5,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES5').then(
                        function (res) {
                            S5CreateId = res;
                        });
                }
            );
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES6,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES6').then(
                        function (res) {
                            S6CreateId = res;
                        });
                });
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES7,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES7').then(
                        function (res) {
                            S7CreateId = res;
                        });
                });
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_STATES8,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_STATES8').then(
                        function (res) {
                            S8CreateId = res;
                        });
                });
            batchSvrAPI.addBatch('TIMER_TEST.UOP,TIMER_TEST,100,,FREEZER_CLS,4,PARMS').then(
                function () {
                    batchSvrAPI.getCreateId('TIMER_TEST').then(
                        function (res) {
                            timerCreateId = res;
                            done();
                        },
                        function (err) {
                            console.log(err);
                            done();
                        });
                });
        });
    });

    //Uncomment if running this test spec by itself
    //browser.driver.wait(protractor.until.elementLocated(by.id('pageAbout')), 20000);

    describe('Testing state commands Start, Hold, Restart, and Stop at the BPC recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES1');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S1CreateId, 'VANILLA_STATES1', 'RUNNING', 20000)
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

        it('Command the batch into the HELD state', function (done) {
            commandButton.clickMenuButton('HOLD')
                .then(function () {
                    return batchSvrAPI.waitForState(S1CreateId, 'VANILLA_STATES1', 'HELD', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons once the batch is in the HELD state', function (done) {
            commandButton.isVisible('hold', false)
                .then(function () {
                    return commandButton.isVisible('restart', true)
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

        it('Command the batch to restart ', function (done) {
            commandButton.clickMenuButton('RESTART')
                .then(function () {
                    return batchSvrAPI.waitForState(S1CreateId, 'VANILLA_STATES1', 'RUNNING', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons once the batch is in the RUNNING state', function (done) {
            commandButton.isVisible('start', false)
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
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the batch to STOP ', function (done) {
            commandButton.clickMenuButton('STOP')
                .then(function () {
                    return batchSvrAPI.waitForState(S1CreateId, 'VANILLA_STATES1', 'STOPPED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons once the batch is in the STOPPED state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('remove', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing state commands Start and Abort at the BPC recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES2');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S2CreateId, 'VANILLA_STATES2', 'RUNNING', 15000)
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
                    return commandButton.isVisible('start', false);
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

        it('Command the batch to ABORT ', function (done) {
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S2CreateId, 'VANILLA_STATES2', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons once the batch is in the ABORTED state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('remove', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing state commands Start, Hold, Restart, and Stop at the UPC recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES3');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S3CreateId, 'CLS_SWEETCREAM_UP:1', 'RUNNING', 15000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the detail page', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UPC level', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UPC into semi-auto mode', function (done) {
            commandButton.clickMenuButton('semi-auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S3CreateId, 'CLS_SWEETCREAM_UP:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UPC level after being placed into semi-auto mode', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', true)
                })
                .then(function () {
                    return commandButton.isVisible('abort', true)
                })
                .then(function () {
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UPC into the HELD state', function (done) {
            commandButton.clickMenuButton('HOLD')
                .then(function () {
                    return batchSvrAPI.waitForState(S3CreateId, 'CLS_SWEETCREAM_UP:1', 'HELD', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UPC level after the UPC is in the HELD state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('abort', true)
                })
                .then(function () {
                    return commandButton.isVisible('stop', true)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('With focus still on the UPC, drill up to the BPC level of the recipe ', function (done) {
            SFC.drillIntoStep('SFCStart')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the UPC at the BPC level of the recipe', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', true)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
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

        it('Bring focus to the BPC level of the recipe ', function (done) {
            SFC.drillIntoStep('SFCStart')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the BPC level of the recipe', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill back into the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UPC to RESTART', function (done) {
            commandButton.clickMenuButton('RESTART')
                .then(function () {
                    return batchSvrAPI.waitForState(S3CreateId, 'CLS_SWEETCREAM_UP:1', 'RUNNING', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the UPC level of the recipe after the UPC has been RESTARTED', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
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
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UPC into the STOPPED state', function (done) {
            commandButton.clickMenuButton('STOP')
                .then(function () {
                    return batchSvrAPI.waitForState(S3CreateId, 'CLS_SWEETCREAM_UP:1', 'STOPPED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the UPC level of the recipe after the UPC has been STOPPED', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill up to the BPC level of the recipe ', function (done) {
            SFC.selectBreadCrumb('VANILLA_STATES3')
                .then(function () {
                    done();
                }).catch(function (err) {
                console.log(err);
                done();
            });
        });

        it('Command the batch into AUTO mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S3CreateId, 'VANILLA_STATES3', 'O_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the BPC level of the recipe after the BPC is in AUTO mode', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
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
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', false)
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
            commandButton.clickMenuButton('ABORT').then(
                function () {
                    batchSvrAPI.waitForState(S3CreateId, 'VANILLA_STATES3', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing state commands Start and Abort at the UPC recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES4');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S4CreateId, 'CLS_SWEETCREAM_UP:1', 'RUNNING', 10000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the detail page', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UPC into semi-auto mode', function (done) {
            commandButton.clickMenuButton('semi-auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S4CreateId, 'CLS_SWEETCREAM_UP:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UPC into the ABORTED state', function (done) {
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S4CreateId, 'CLS_SWEETCREAM_UP:1', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UPC level after the UPC is in the ABORTED state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    commandButton.isVisible('restart', false)
                })
                .then(function () {
                    commandButton.isVisible('hold', false)
                })
                .then(function () {
                    commandButton.isVisible('abort', false)
                })
                .then(function () {
                    commandButton.isVisible('stop', false)
                })
                .then(function () {
                    commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    commandButton.isVisible('manual', true)
                })
                .then(function () {
                    commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return to the BPC level of the recipe ', function (done) {
            SFC.selectBreadCrumb('VANILLA_STATES4')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the batch into AUTO mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S4CreateId, 'VANILLA_STATES4', 'O_AUTO', 20000)
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
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S4CreateId, 'VANILLA_STATES4', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing state commands Start, Hold, Restart, and Stop at the UOP recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES5');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S5CreateId, 'CLS_SWEETCREAM_OP:1', 'RUNNING', 10000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the detail page', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UOP level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_OP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UOP level', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UOP into semi-auto mode', function (done) {
            commandButton.clickMenuButton('semi-auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S5CreateId, 'CLS_SWEETCREAM_OP:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UPC level after being placed into semi-auto mode', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
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
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UOP into the HELD state', function (done) {
            commandButton.clickMenuButton('HOLD')
                .then(function () {
                    batchSvrAPI.waitForState(S5CreateId, 'CLS_SWEETCREAM_OP:1', 'HELD', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UOP level after the UOP is in the HELD state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('stop', true)
                })
                .then(function () {
                    return commandButton.isVisible('abort', true)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('With focus still on the UOP, drill up to the UPC level of the recipe ', function (done) {
            SFC.drillIntoStep('SFCStart')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the UOP at the UPC level of the SFC', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('hold', false)
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

        it('Bring focus to the UPC level of the recipe ', function (done) {
            SFC.drillIntoStep('SFCStart')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the UPC level of the recipe', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill back up to the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill back into the UOP level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_OP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UOP to RESTART', function (done) {
            commandButton.clickMenuButton('RESTART')
                .then(function () {
                    return batchSvrAPI.waitForState(S5CreateId, 'CLS_SWEETCREAM_OP:1', 'RUNNING', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the UOP level of the recipe after the UOP has been RESTARTED', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
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
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                        done();
                    },
                    function (err) {
                        console.log(err);
                        done();
                    });
        });

        it('Command the UOP into the STOPPED state', function (done) {
            commandButton.clickMenuButton('STOP')
                .then(function () {
                    return batchSvrAPI.waitForState(S5CreateId, 'CLS_SWEETCREAM_OP:1', 'STOPPED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the UOP level of the recipe after the UOP has been STOPPED', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return to the BPC level of the recipe ', function (done) {
            SFC.selectBreadCrumb('VANILLA_STATES5')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                })
        });

        it('Command the batch into AUTO mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S5CreateId, 'VANILLA_STATES5', 'O_AUTO', 20000)
                })
                .then(function () {
                    done();
                }, function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the BPC level of the recipe after the BPC is in AUTO mode', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
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
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', false)
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
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S5CreateId, 'VANILLA_STATES5', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing state commands Start and Abort at the UPC recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES6');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S6CreateId, 'CLS_SWEETCREAM_OP:1', 'RUNNING', 10000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the detail page', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UOP level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_OP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UOP into semi-auto mode', function (done) {
            commandButton.clickMenuButton('semi-auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S6CreateId, 'CLS_SWEETCREAM_OP:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the UOP into the ABORTED state', function (done) {
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S6CreateId, 'CLS_SWEETCREAM_OP:1', 'ABORTED', 10000)
                })
                .then(function () {
                    done();

                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the UOP level after the UOP is in the ABORTED state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill up to the BPC level of the recipe ', function (done) {
            SFC.selectBreadCrumb('VANILLA_STATES6')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                })
        });

        it('Command the batch into AUTO mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S6CreateId, 'VANILLA_STATES6', 'O_AUTO', 20000)
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
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S6CreateId, 'VANILLA_STATES6', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing state commands Start, Hold, Restart, Resume and Stop at the Phase recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES7');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S7CreateId, 'ADD_EGG:1', 'RUNNING', 10000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the detail page', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UOP level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_OP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Select a phase to command', function (done) {
            SFC.highlightStep('ADD_EGG:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the default command buttons at the Phase level', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('auto', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the phase into semi-auto mode', function (done) {
            commandButton.clickMenuButton('semi-auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S7CreateId, 'ADD_EGG:1', 'S_AUTO', 30000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the Phase after placing the Phase into semi-auto mode', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('resume', true)
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
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the Phase into the HELD state', function (done) {
            commandButton.clickMenuButton('HOLD')
                .then(function () {
                    return batchSvrAPI.waitForState(S7CreateId, 'ADD_EGG:1', 'HELD', 30000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the Phase level after the Phase is in the HELD state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('resume', true)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', true)
                })
                .then(function () {
                    return commandButton.isVisible('abort', true)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the Phase to RESTART', function (done) {
            commandButton.clickMenuButton('RESTART')
                .then(function () {
                    return batchSvrAPI.waitForState(S7CreateId, 'ADD_EGG:1', 'RUNNING', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the Phase level of the recipe after the Phase has been RESTARTED', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('resume', true)
                })
                .then(function () {
                    return commandButton.isVisible('hold', true)
                })
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', true)
                })
                .then(function () {
                    return commandButton.isVisible('abort', true)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the Phase into the STOPPED state', function (done) {
            commandButton.clickMenuButton('STOP')
                .then(function () {
                    return batchSvrAPI.waitForState(S7CreateId, 'ADD_EGG:1', 'STOPPED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the Phase level of the recipe after the Phase has been STOPPED', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('resume', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return to the BPC level of the recipe ', function (done) {
            SFC.selectBreadCrumb('VANILLA_STATES7')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the batch into AUTO mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S7CreateId, 'VANILLA_STATES7', 'O_AUTO', 20000)
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
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S7CreateId, 'VANILLA_STATES7', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing state commands Start and Abort at the Phase recipe level:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_STATES8');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(S8CreateId, 'ADD_EGG:1', 'RUNNING', 10000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the detail page', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UPC level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Drill into the UOP level of the recipe', function (done) {
            SFC.drillIntoStep('CLS_SWEETCREAM_OP:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Select a phase to command', function (done) {
            SFC.highlightStep('ADD_EGG:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the phase into semi-auto mode', function (done) {
            commandButton.clickMenuButton('semi-auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S8CreateId, 'ADD_EGG:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the Phase to the ABORTED state', function (done) {
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S8CreateId, 'ADD_EGG:1', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons at the Phase level after the Phase is in the ABORTED state', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('resume', false)
                })
                .then(function () {
                    return commandButton.isVisible('hold', false)
                })
                .then(function () {
                    return commandButton.isVisible('stop', false)
                })
                .then(function () {
                    return commandButton.isVisible('abort', false)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', true)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return to the BPC level of the recipe ', function (done) {
            SFC.selectBreadCrumb('VANILLA_STATES8')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the batch into AUTO mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    return batchSvrAPI.waitForState(S8CreateId, 'VANILLA_STATES8', 'O_AUTO', 20000)
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
            commandButton.clickMenuButton('ABORT')
                .then(function () {
                    return batchSvrAPI.waitForState(S8CreateId, 'VANILLA_STATES8', 'ABORTED', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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

    describe('Testing Timer Step command buttons:', function () {
        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('TIMER_TEST');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(timerCreateId, 'TIMER:1', 'RUNNING', 10000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the detail page', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command recipe into manual mode', function (done) {
            commandButton.clickMenuButton('manual')
                .then(function () {
                    batchSvrAPI.waitForState(timerCreateId, 'TIMER_TEST', 'MANUAL', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Select the timer phase', function (done) {
            SFC.highlightStep('TIMER:1')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the command buttons for the timer step', function (done) {
            commandButton.isVisible('start', false)
                .then(function () {
                    return commandButton.isVisible('restart', false)
                })
                .then(function () {
                    return commandButton.isVisible('resume', false)
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
                    return commandButton.isVisible('timer-reset', true)
                })
                .then(function () {
                    return commandButton.isVisible('timer-complete', true)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    return commandButton.isVisible('semi-auto', false)
                })
                .then(function () {
                    return commandButton.isVisible('auto', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the timer step to complete', function (done) {
            commandButton.clickMenuButton('timer-complete')
                .then(function () {
                    return batchSvrAPI.waitForState(timerCreateId, 'TIMER:1', 'COMPLETE', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return to the top level of the recipe ', function (done) {
            SFC.drillIntoStep('SFCStart')
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Command the batch into AUTO mode', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    batchSvrAPI.waitForState(timerCreateId, 'TIMER_TEST', 'O_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Remove batch from the batch list', function (done) {
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