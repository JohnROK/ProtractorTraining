/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                      08/29/2016      John Armstrong           Initial Version
 *                      09/23/2016      John Armstrong           Refactored code to be synchronous
 *
 *
 * Description: This will test that when a BPC, UPC, UOP, and Operation
 *              changes Mode to and from Auto, Semi-Auto,and Manual while in the
 *              Running state, the Mobility client (Batch View) disables/enables the
 *              correct Mode commands at each level of the recipe and the Batch
 *              Summary page updates with the correct Mode information.
 */

(function () {
    'use strict';
    var utilModules = './../../../Utility Modules/',
        navigate = require(utilModules + 'Site Navigation/Navigate'),
        selectBatch = require(utilModules + 'Batches Page/SelectBatch'),
        SFC = require(utilModules + 'Batches Page/Detail-View'),
        summaryPage = require(utilModules + 'Batches Page/Summary-View'),
        commandButton = require(utilModules + 'Batches Page/ActionBarButtons'),
        batchSvrAPI = require(utilModules + 'Batch Server/BatchServerAPI'),
        VANILLA_1, VANILLA_2, VANILLA_3, VANILLA_4;

    describe('Test 02_Modes_Running_Auto_Man_Semi Setup', function () {
        it('Add required batches to the batch list', function (done) {
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_1,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                function () {
                    batchSvrAPI.getCreateId('VANILLA_1').then(
                        function (res) {
                            VANILLA_1 = res;
                        });
                    batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_2,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                        function () {
                            batchSvrAPI.getCreateId('VANILLA_2').then(
                                function (res) {
                                    VANILLA_2 = res;
                                });
                        });
                    batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_3,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                        function () {
                            batchSvrAPI.getCreateId('VANILLA_3').then(
                                function (res) {
                                    VANILLA_3 = res;
                                });
                        });
                    batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_4,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750').then(
                        function () {
                            batchSvrAPI.getCreateId('VANILLA_4').then(
                                function (res) {
                                    VANILLA_4 = res;
                                    done();
                                });
                        });
                });
        });
    });

    //Uncomment if running this test spec by itself
    //browser.driver.wait(protractor.until.elementLocated(by.id('pageAbout')), 20000);

    describe('Command a BPC into Manual mode while in the Running state:', function () {

        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_1');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(VANILLA_1, 'VANILLA_1', 'RUNNING', 15000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Take a Procedure level recipe in the Running state and place it into Manual mode', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    return commandButton.clickMenuButton('manual')
                })
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_1, 'VANILLA_1', 'MANUAL', 10000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the correct Mode commands are visible at the Batch Procedure level', function (done) {
            commandButton.isVisible('auto', true)
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify Mode commands at the Unit Procedure level', function (done) {
            SFC.highlightStep('CLS_SWEETCREAM_UP:1')
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', true);
                    commandButton.isVisible('manual', true);
                    return SFC.highlightStep('CLS_TRANSFER_IN_UP:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', false);
                    commandButton.isVisible('manual', false);
                    return SFC.highlightStep('CLS_TRANSFER_OUT_UP:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', false);
                    commandButton.isVisible('manual', false);
                    return SFC.highlightStep('CLS_FRENCHVANILLA_UP:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', false);
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the modes in the Summary page', function (done) {
            var modesArray = ['MANUAL', 'O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            SFC.drillIntoStep('SFCStart')
                .then(function () {
                    return navigate.toInnerPage('summary');
                })
                .then(function () {
                    return summaryPage.verifyAllModes(modesArray);
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                })
        });

        it('Return the recipe to Auto', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_1, 'VANILLA_1', 'O_AUTO', 15000)
                })
                .then(function () {
                        done();
                    },
                    function (err) {
                        console.log(err);
                        done();
                    });
        });

        it('Verify the mode changed to Auto in the Summary page', function (done) {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            return summaryPage.verifyAllModes(modesArray)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Abort the batch and remove it from the batch list', function (done) {
            commandButton.clickMenuButton('abort')
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_1, 'VANILLA_1', 'ABORTED', 15000)
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

    describe('Command a UPC into Semi-Auto mode while in the Running state:', function () {

        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_2');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(VANILLA_2, 'VANILLA_2', 'RUNNING', 15000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the UPC level and place the Running UPC into Semi-Auto mode', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    return SFC.highlightStep('CLS_SWEETCREAM_UP:1')
                })
                .then(function () {
                    return commandButton.clickMenuButton('semi-auto');
                })
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_2, 'CLS_SWEETCREAM_UP:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify Mode commands at the Unit Procedure level', function (done) {
            commandButton.isVisible('auto', true)
                .then(function () {
                    commandButton.isVisible('semi-auto', false);
                    commandButton.isVisible('manual', true);
                    return SFC.highlightStep('CLS_TRANSFER_IN_UP:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', false);
                    commandButton.isVisible('manual', false);
                    return SFC.highlightStep('CLS_TRANSFER_OUT_UP:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', false);
                    commandButton.isVisible('manual', false);
                    return SFC.highlightStep('CLS_FRENCHVANILLA_UP:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', false);
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the modes in the Summary page', function (done) {
            var modesArray = ['MANUAL', 'S_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            SFC.drillIntoStep('SFCStart')
                .then(function () {
                    return navigate.toInnerPage('summary')
                })
                .then(function () {
                    return summaryPage.verifyAllModes(modesArray);
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                })
        });

        it('Return the recipe to Auto', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    done();
                })
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_2, 'VANILLA_2', 'O_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the mode changed to Auto in the Summary page', function (done) {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            summaryPage.verifyAllModes(modesArray)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Abort the batch ', function (done) {
            commandButton.clickMenuButton('abort')
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_2, 'VANILLA_2', 'ABORTED', 20000)
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

    describe('Command a UOP into Manual mode while in the Running state:', function () {

        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_3');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(VANILLA_3, 'VANILLA_3', 'RUNNING', 20000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the UOP level and place the Running UOP into Manual mode', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    return SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                })
                .then(function () {
                    return SFC.highlightStep('CLS_SWEETCREAM_OP:1')
                })
                .then(function () {
                    return commandButton.clickMenuButton('manual')
                })
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_3, 'CLS_SWEETCREAM_OP:1', 'MANUAL', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify Mode commands at the Unit Operation level', function (done) {
            commandButton.isVisible('auto', true)
                .then(function () {
                    return commandButton.isVisible('semi-auto', true)
                })
                .then(function () {
                    return commandButton.isVisible('manual', false)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the modes in the Summary page', function (done) {
            var modesArray = ['MANUAL', 'MANUAL', 'MANUAL', 'O_AUTO', 'O_AUTO', 'O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            SFC.selectBreadCrumb('VANILLA_3')
                .then(function () {
                    return navigate.toInnerPage('summary')
                })
                .then(function () {
                    return summaryPage.verifyAllModes(modesArray)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return the recipe to Auto', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    done();
                })
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_3, 'VANILLA_3', 'O_AUTO', 20000)
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the mode changed to Auto in the Summary page', function (done) {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            summaryPage.verifyAllModes(modesArray)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Abort the batch ', function (done) {
            commandButton.clickMenuButton('abort')
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_3, 'VANILLA_3', 'ABORTED', 20000)
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

    describe('Command a Phase into Semi-Auto mode while in the Running state:', function () {

        it('Start the batch', function (done) {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.id('pageBatches')), 10000);
            selectBatch.byName('VANILLA_4');
            commandButton.clickMenuButton('start');
            batchSvrAPI.waitForState(VANILLA_4, 'VANILLA_4', 'RUNNING', 20000)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Navigate to the Operation level and place the Running Operation into Semi-Auto mode', function (done) {
            navigate.toInnerPage('detail')
                .then(function () {
                    return SFC.drillIntoStep('CLS_SWEETCREAM_UP:1')
                })
                .then(function () {
                    return SFC.drillIntoStep('CLS_SWEETCREAM_OP:1')
                })
                .then(function () {
                    return SFC.highlightStep('ADD_EGG:1')
                })
                .then(function () {
                    return commandButton.clickMenuButton('semi-auto')
                })
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_4, 'ADD_EGG:1', 'S_AUTO', 20000)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify Mode commands at the Phase level', function (done) {
            SFC.highlightStep('ADD_CREAM:1')
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', false);
                    commandButton.isVisible('manual', false);
                    return SFC.highlightStep('AGITATE:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', true);
                    commandButton.isVisible('manual', false);
                    SFC.highlightStep('ADD_EGG:1')
                })
                .then(function () {
                    commandButton.isVisible('auto', false);
                    commandButton.isVisible('semi-auto', true);
                    return commandButton.isVisible('manual', false)
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
            SFC.selectBreadCrumb('VANILLA_4').then(function(){
                done();
            });
        });

        it('Verify the modes in the Summary page', function (done) {
            var modesArray = ['MANUAL', 'MANUAL', 'MANUAL', 'S_AUTO', 'O_AUTO', 'O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary')
                .then(function () {
                    return summaryPage.verifyAllModes(modesArray)
                })
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Return the recipe to Auto', function (done) {
            commandButton.clickMenuButton('auto')
                .then(function () {
                    done();
                })
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_4, 'VANILLA_4', 'O_AUTO', 20000)
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Verify the mode changed to Auto in the Summary page', function (done) {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            summaryPage.verifyAllModes(modesArray)
                .then(function () {
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });

        it('Abort the batch ', function (done) {
            commandButton.clickMenuButton('abort')
                .then(function () {
                    return batchSvrAPI.waitForState(VANILLA_4, 'VANILLA_4', 'ABORTED', 20000)
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
                    done()
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
        });
    });

})();

