'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = () => {
    return actor({
        authenticateWithIdam: steps.idam.signIn,
      chooseNextStep: steps.nextStep.nextStep
    });
};
