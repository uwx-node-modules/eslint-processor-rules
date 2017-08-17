// see https://github.com/uwx/eslint
/**
 * Usage:
 * <outer scope> var settings;
 * <preprocess function> settings = new Settings(config, '<plugin name, like css or json>');
 * <postprocess function> messages.filter(settings.isEnabled).concat(settings.getBadRules());
 */
class Settings {
  /**
   * config: eslint config object (argument 3), blank is valid
   * name: plugin name (not including the 'eslint-plugin-' part)
   */
  constructor(config, name) {
    // automatically detect if no settings provided or not using my eslint fork
    if (config && config.settings && config.settings[name]) {
      this.settings = config.settings[name];
      
      // no need to create these otherwise since it will fast track
      this.badRules = [];
      this.name = name;
    }
  }
  /**
   * ruleId: eslint config rule id (not including prefix)
   * def: fallback default rule setting (1 or 2 but not 0)
   */
  get(ruleId, def) {
    if (!this.settings) {
        return def;
    }
    var setting = this.settings[ruleId];
    // unset, use default
    if (setting === undefined) { // will never be null in a reasonable case so undefined is ok
        return def;
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
    this.badRules.push({
        ruleId: 'bad-css-rule-' + ruleId,
        severity: 2,
        message: `Invalid custom rule setting "${setting}" for "${this.name}/${ruleId}", must be one of 0/1/2/off/warn/error`,
        source: '<none>',
        line: 1,
        column: this.badRules.length,
    });
    return def;
  }
  getBadRules() {
    const v = this.badRules;
    delete this.badRules;
    return v;
  }
  isEnabled(e) {
    return e.severity !== null;
  }
}
