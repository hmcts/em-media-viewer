import {Given, Then, When} from 'cucumber';
import {RedactPage} from '../pages/redact.po';
import {GenericMethods} from '../utils/genericMethods';
import * as mediaviewer from './media-viewer';

const genericMethods = new GenericMethods();
const redactPage: RedactPage = new RedactPage();

When('I click on the Redact button', async () => {
  await redactPage.clickRedact();
});

Then('I can remove the redaction', async function () {
  await redactPage.removeRedactionMethod();
});

When('I can ensure the area has been redacted', async function () {
  await redactPage.visibleRedaction();
});

Then('I can ensure the redaction has been removed', async function () {
  await genericMethods.sleep(5000);
  await redactPage.visibleRedaction();
});


Given('I click on redact text', async function () {
  await redactPage.clickText();
});

Given('I click on draw a box', async function () {
  await redactPage.clickBox();
});

Given('that I have change the document to a dm-store document and', async function () {
  await redactPage.changeToDocStoreDoc();
});

Given('that I have created both a text and box redaction', async function () {
  await redactPage.clickBox();
  await mediaviewer.drawOnPdf(950, 950);
  await genericMethods.sleep(500);
  await redactPage.visibleRedaction();

  await redactPage.clickText();
  await mediaviewer.highLightTextInPdf();
  await genericMethods.sleep(500);
  await redactPage.visibleRedaction();
});

Given('that I have created a box redaction', mediaviewer.highLightOnImage);


When('I clear all the redactions using the clear all button', async function () {
  await redactPage.clearAll();
});

Then('all the redactions should be cleared', async function () {
  await genericMethods.sleep(2000);
  await redactPage.checkAllRedactionsCleared();
  await genericMethods.sleep(1000);
});

Then('I preview the document with the redactions', async function () {
  await redactPage.preview();
});

Then('I ensure the preview is correct', async function () {
  await redactPage.checkPreview();
  await genericMethods.sleep(1000);
});

Then('I switch back from the preview view', async function () {
  await redactPage.preview();
});

When('I save the document with the redactions', async function () {
  await redactPage.save();
});
