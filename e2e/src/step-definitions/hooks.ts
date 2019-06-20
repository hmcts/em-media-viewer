import { Before, After, Status } from 'cucumber';
import { browser } from 'protractor';


Before({tags: '@Toolbar_ToggleButtons'}, function() {
  browser.manage().window().maximize();
});


After(function() {
  console.log('Successfully run the test!!!');
});

After( async function(scenario) {
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await browser.takeScreenshot();
    this.attach(screenshot, 'image/png');
  }
});
