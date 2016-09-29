/**
 * Created By: John Armstrong
 *
 * Change History:      Date            Developer                Description
 *                      08/25/2016      John Armstrong           Initial Version
 *
 *
 * Description: This will test that when a BPC recipe, UPC recipe, and UOP recipe
 *              changes Mode to and from Auto, Semi-Auto,and Manual while in the
 *              Ready state, the Mobility client (Batch View) disables/enables the
 *              correct Mode commands at each level of the recipe and the Batch
 *              Summary page updates with the correct Mode information.
 *
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
        createIdBPC, createIdUPC, createIdUOP;

    describe('Test 01_Modes_Ready_Auto_Man_Semi Setup', function () {
        it('Add required batches to the batch list', function (done) {
            batchSvrAPI.addBatch('CLS_FRENCHVANILLA.BPC,VANILLA_BPC,100,French Vanilla Premium - class based ,FREEZER,4,MIXER,2,PARMS,MILK_AMOUNT,1999,CREAM_AMOUNT,2001,FLAVOR_AMOUNT,50,EGG_AMOUNT,200,SUGAR_AMOUNT,750')
                .then(function () {
                    batchSvrAPI.getCreateId('VANILLA_BPC')
                })
                .then(function (res) {
                    createIdBPC = res;
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });

            batchSvrAPI.addBatch('CLS_FRENCHVANILLA_UP.UPC,VANILLA_UPC,100,French Vanilla Premium - class based - on-line transfer,FREEZER_CLS,4,PARMS,FLAVOR_AMOUNT,0')
                .then(function () {
                    batchSvrAPI.getCreateId('VANILLA_UPC')
                })
                .then(function (res) {
                    createIdUPC = res;
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });

            batchSvrAPI.addBatch('CLS_FRENCHVANILLA_OP.UOP,VANILLA_UOP,100,French Vanilla Premium - class based,FREEZER_CLS,4,PARMS,FLAVOR_AMOUNT,20')
                .then(function () {
                    return batchSvrAPI.getCreateId('VANILLA_UOP')
                })
                .then(function (res) {
                    createIdUOP = res;
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done()
                });
        });
    });

    //Wait for the About Page to load before allowing Protractor to run the tests
    browser.driver.wait(protractor.until.elementLocated(by.id('pageAbout')), 20000);

    describe('Placing a BPC level recipe in Manual mode while in the Ready state:', function () {

        it('Verify the correct Mode commands are visible on the Summary page', function () {
            navigate.toPage('batches');
            browser.driver.wait(protractor.until.elementLocated(by.css('.bm-list-group-item')), 10000);
            selectBatch.byName('VANILLA_BPC');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', true);
            commandButton.isVisible('manual', true);
        });

        it('Take a Procedure level recipe in the Ready state and place it into Manual mode', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('manual');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Manual in the Summary page', function () {

            var modesArray = ['MANUAL', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });

        it('Verify the correct Mode commands are visible at the Batch Procedure level', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', true);
            commandButton.isVisible('semi-auto', true);
            commandButton.isVisible('manual', false);
            browser.driver.sleep(1000);
        });

        it('Verify Mode commands are not available at the Unit Procedure level', function () {
            SFC.highlightStep('CLS_SWEETCREAM_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('CLS_TRANSFER_IN_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('CLS_TRANSFER_OUT_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('CLS_FRENCHVANILLA_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Verify Mode commands are not available at the Unit Operation level', function () {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1');
            SFC.highlightStep('CLS_SWEETCREAM_OP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Verify Mode commands are not available at the Phase level', function () {
            SFC.drillIntoStep('CLS_SWEETCREAM_OP:1');
            SFC.highlightStep('ADD_EGG:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('ADD_CREAM:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('ADD_MILK:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Return to the Batch Procedure level and place the batch in Auto', function () {
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('auto');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Auto in the Summary page', function () {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });
    });

    describe('Placing a BPC level recipe in Semi-Auto mode while in the Ready state:', function () {

        /*//UNCOMMENT- If running this 'describe' by itself
         navigate.toPage('batches');
         browser.driver.sleep(1000);
         selectBatch.byName('VANILLA_BPC');
         browser.driver.sleep(1000);*/

        it('Place the Batch into Semi-Auto mode', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('semi-auto');
            browser.driver.sleep(3000);
        });

        it('Verify the mode changed to Semi-Auto in the Summary page', function () {

            var modesArray = ['S_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];


            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });

        it('Verify the correct Mode commands are present at the Batch Procedure level', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', true);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', true);
        });

        it('Verify Mode commands are not available at the Unit Procedure level', function () {
            SFC.highlightStep('CLS_SWEETCREAM_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('CLS_TRANSFER_IN_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('CLS_TRANSFER_OUT_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('CLS_FRENCHVANILLA_UP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Verify Mode commands are not available at the Unit Operation level', function () {
            SFC.drillIntoStep('CLS_SWEETCREAM_UP:1');
            SFC.highlightStep('CLS_SWEETCREAM_OP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Verify Mode commands are not available at the Phase level', function () {
            SFC.drillIntoStep('CLS_SWEETCREAM_OP:1');
            SFC.highlightStep('ADD_EGG:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('ADD_CREAM:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('ADD_MILK:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Return to the Batch Procedure level and place the batch in Auto', function () {
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('auto');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Auto in the Summary page', function () {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO',
                'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(1000);
        });

        it('Test Cleanup, Remove BPC from batch list', function () {
            commandButton.clickMenuButton('remove');
            browser.driver.sleep(1000);
            navigate.toPage('equipment');
            browser.driver.sleep(1000);
        });
    });

    describe('Placing a UPC level recipe in Manual mode while in the Ready state:', function () {

        it('Verify the correct Mode commands are present on the Summary page', function () {
            navigate.toPage('batches');
            browser.driver.sleep(1000);
            selectBatch.byName('VANILLA_UPC');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', true);
            commandButton.isVisible('manual', true);
        });

        it('Take a Unit Procedure level recipe in the Ready state and place it into Manual mode', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('manual');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Manual in the Summary page', function () {

            var modesArray = ['MANUAL', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });

        it('Verify the correct Mode commands are present at the Unit Procedure level', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', true);
            commandButton.isVisible('semi-auto', true);
            commandButton.isVisible('manual', false);
            browser.driver.sleep(1000);
        });

        it('Verify Mode commands are not available at the Unit Operation level', function () {
            SFC.highlightStep('CLS_FRENCHVANILLA_OP:1');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Verify Mode commands are not available at the Operation level', function () {
            SFC.drillIntoStep('CLS_FRENCHVANILLA_OP:1');
            SFC.highlightStep('ADD_FLAVOR:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('RECIRC:2');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('DUMP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

        });

        it('Return to the Unit Procedure level and place the batch in Auto', function () {
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('auto');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Auto in the Summary page', function () {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });
    });

    describe('Placing a UPC level recipe in Semi-Auto mode while in the Ready state:', function () {
        /*//UNCOMMENT- If running this 'describe' by itself
         navigate.toPage('batches');
         browser.driver.sleep(1000);
         selectBatch.byName('VANILLA_UPC');
         browser.driver.sleep(1000);
         navigate.toInnerPage('detail');
         browser.driver.sleep(1000);*/

        it('Place the Batch into Semi-Auto mode', function () {
            commandButton.clickMenuButton('semi-auto');
            browser.driver.sleep(3000);
        });

        it('Verify the mode changed to Semi-Auto in the Summary page', function () {
            var modesArray = ['S_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });

        it('Verify the correct Mode commands are present at the Unit Procedure level', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', true);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', true);
        });

        it('Verify Mode commands are not available at the Unit Operation level', function () {
            SFC.highlightStep('CLS_FRENCHVANILLA_OP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Verify Mode commands are not available at the Operation level', function () {
            SFC.drillIntoStep('CLS_FRENCHVANILLA_OP:1');
            SFC.highlightStep('ADD_FLAVOR:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('RECIRC:2');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('DUMP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Return to the Unit Procedure level and place the batch in Auto', function () {
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('auto');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Auto in the Summary page', function () {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(1000);
        });

        it('Test Cleanup, Remove UPC from batch list', function () {
            commandButton.clickMenuButton('remove');
            browser.driver.sleep(1000);
            navigate.toPage('equipment');
            browser.driver.sleep(1000);
        });
    });

    describe('Placing a UOP level recipe in Manual mode while in the Ready state:', function () {

        it('Verify the correct Mode commands are present on the Summary page', function () {
            navigate.toPage('batches');
            browser.driver.sleep(1000);
            selectBatch.byName('VANILLA_UOP');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', true);
            commandButton.isVisible('manual', true);
        });

        it('Take a Unit Operation level recipe in the Ready state and place it into Manual mode', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('manual');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Manual in the Summary page', function () {
            var modesArray = ['MANUAL', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });

        it('Verify the correct Mode commands are present at the Unit Operation level', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', true);
            commandButton.isVisible('semi-auto', true);
            commandButton.isVisible('manual', false);
            browser.driver.sleep(1000);
        });

        it('Verify Mode commands are not available at the Operation level', function () {
            SFC.highlightStep('ADD_FLAVOR:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('RECIRC:2');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('DUMP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Return to the Unit Procedure level and place the batch in Auto', function () {
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('auto');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Auto in the Summary page', function () {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });
    });

    describe('Placing a UOP level recipe in Semi-Auto mode while in the Ready state:', function () {
        /*//UNCOMMENT- If running this 'describe' by itself
         navigate.toPage('batches');
         browser.driver.sleep(1000);
         selectBatch.byName('VANILLA_UOP');
         browser.driver.sleep(1000);
         navigate.toInnerPage('detail');
         browser.driver.sleep(1000);*/

        it('Place the Batch into Semi-Auto mode', function () {
            commandButton.clickMenuButton('semi-auto');
            browser.driver.sleep(3000);
        });

        it('Verify the mode changed to Semi-Auto in the Summary page', function () {
            var modesArray = ['S_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(3000);
        });

        it('Verify the correct Mode commands are present at the Unit Operation level', function () {
            navigate.toInnerPage('detail');
            browser.driver.sleep(1000);
            commandButton.isVisible('auto', true);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', true);
        });

        it('Verify Mode commands are not available at the Operation level', function () {
            SFC.highlightStep('ADD_FLAVOR:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('RECIRC:2');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);

            SFC.highlightStep('DUMP:1');
            //browser.driver.sleep(1000);
            commandButton.isVisible('auto', false);
            commandButton.isVisible('semi-auto', false);
            commandButton.isVisible('manual', false);
        });

        it('Return to the Unit Procedure level and place the batch in Auto', function () {
            SFC.drillIntoStep('SFCStart');
            browser.driver.sleep(1000);
            commandButton.clickMenuButton('auto');
            browser.driver.sleep(1000);
        });

        it('Verify the mode changed to Auto in the Summary page', function () {
            var modesArray = ['O_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO', 'P_AUTO'];

            navigate.toInnerPage('summary');
            browser.driver.sleep(3000);
            summaryPage.verifyAllModes(modesArray);
            browser.driver.sleep(1000);
        });

        it('Test Cleanup, Remove UOP from batch list', function () {
            commandButton.clickMenuButton('remove');
            browser.driver.sleep(1000);
            navigate.toPage('equipment');
            browser.driver.sleep(1000);
        });
    });
})();