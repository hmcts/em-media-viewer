/**
 * Helper Class
 * Used for dynamic templates manipulation
 * */

export class HtmlTemplatesHelper {

  static setDescribedBy(errorMessage, config) {
    if (!errorMessage) {
      return config.hint ? `${config.id}-hint` : null;
    } else if (errorMessage && errorMessage.isInvalid) {
      return  config.hint ? `${config.id}-hint ${config.id}-error` : `${config.id}-error`;
    } else {
      return config.hint ? `${config.id}-hint` : null;
    }
  }
}
