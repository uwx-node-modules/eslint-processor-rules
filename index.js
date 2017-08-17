// see https://github.com/uwx/eslint
class Settings {
  constructor(config, name) {
    if (config) {
      this.settings = config.settings.css;
    }
  }
  get(ruleId, badRules, default) { // fallback = type == 'error' ? 2 : 1;
    if (!this.settings) {
        return default;
    }
    var setting = this.settings[ruleId];
    // unset, use default
    if (setting === undefined) { // will never be null in a reasonable case so undefined is ok
        return default;
    }
    // manually disabled
    if (setting === 0 || setting == 'off') {
        return null; // will filter out e.severity === null later on
    }
    // warn (level 1)
    if (setting === 1 || setting == 'warn') {
        return this.settings[ruleId] = 1;
    }
    // error (level 2)
    if (setting === 2 || setting == 'error') {
        return this.settings[ruleId] = 2;
    }
    
    // no return, must have bad property value
    badRules.push({
        ruleId: 'bad-css-rule-' + ruleId,
        severity: 2,
        message: 'Invalid CSSLint rule setting "' + setting + '" for "css/' + ruleId + '", must be one of 0/1/2/off/warn/error',
        source: '<none>',
        line: 1,
        column: badRules.length,
    });
    return default;
  }

}
