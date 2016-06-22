/**
 * MashupRx class
 * Master class of the project, this one take
 * a valid config object then start to load the
 * content and setup listeners/observables.
 *
 * @param {object} config Config of the session
 */
class MashupRx {
  constructor (config) {
    this.config = config;

    // Load assets
    this.bank = new AssetBank(config.assets);
  }
}
