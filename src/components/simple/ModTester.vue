<template>
  <div>
    <b-dropdown-item @click="testModModal()">Test Mod</b-dropdown-item>

    <b-modal
      size="lg"
      ref="modal"
      title="Test Mod"
      ok-title="Close"
      ok-only
      ok-variant="secondary"
    >
      <div class="d-block p-1">
        <div class="row mb-3">
          <div class="col-6">
            <strong>Useful Character Settings</strong>
          </div>

          <div class="col-6">
            <strong>
              Extra Character Settings
              <span
v-b-tooltip.hover
title="If your JSON is not well-formed, you cannot run the test."
>{{ validOtherProps ? '✅' : '🚫' }}</span>
            </strong>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-6">
            <b-form>

              <div class="row">
                <div class="col">
                  <b-form-group
label-cols-md="3"
label="Level"
>
                    <b-form-input
                      type="text"
                      v-model="settings.level"
                      placeholder="The player level"
                    />
                  </b-form-group>
                </div>
              </div>
              
              <div class="row">
                <div class="col">
                  <b-form-group
label-cols-md="3"
label="Map"
>
                    <b-form-input
                      type="text"
                      v-model="settings.map"
                      placeholder="The map to spawn on"
                    />
                  </b-form-group>
                </div>
              </div>
              
              <div class="row">
                <div class="col">
                  <b-form-group
label-cols-md="3"
label="Map X"
>
                    <b-form-input
                      type="text"
                      v-model="settings.x"
                      placeholder="The map X to spawn on"
                    />
                  </b-form-group>
                </div>
              </div>
              
              <div class="row">
                <div class="col">
                  <b-form-group
label-cols-md="3"
label="Map Y"
>
                    <b-form-input
                      type="text"
                      v-model="settings.y"
                      placeholder="The map Y to spawn on"
                    />
                  </b-form-group>
                </div>
              </div>

              <div class="row">
                <b-form-checkbox
                  v-model="settings.openClient"
                  class="col-md-9 offset-md-3"
                >
                  <span
                    v-b-tooltip.hover
                    title="If checked, will open the web client to your local server."
                  >Open Client?</span>
                </b-form-checkbox>
              </div>

            </b-form>
          </div>

          <div class="col-6">
            <prism-editor
class="code-editor"
v-model="settings.otherProps"
:highlight="highlighter"
line-numbers
/>
          </div>
        </div>

        <div
class="row my-3"
v-if="numErrors > 0"
>
          <div class="col-12 text-danger text-center">
            Your mod has {{ numErrors }} error(s). Check Menu > Validate Mod for more info.
          </div>
        </div>

        <div class="row">
          <div class="col-8">
            <b-button
block
variant="primary"
@click="testMod()"
:disabled="!validOtherProps || !validTestProps || numErrors > 0"
>Test Mod!</b-button>
          </div>
          <div class="col-4">
            <b-button
block
variant="danger"
@click="killMod()"
>Kill LotR/MongoDB</b-button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import localforage from 'localforage';

import { PrismEditor } from 'vue-prism-editor';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';

import { numErrorsForMod } from '../../helpers';

export default {
  name: 'ModTester',

  props: ['mod'],

  components: { PrismEditor },

  data() {
    return {
      settings: {
        level: 1,
        map: '',
        x: 0,
        y: 0,
        openClient: true,
        otherProps: '{\n  \n}'
      }
    };
  },

  created() {
    this.loadSettings();
  },

  computed: {
    numErrors() {
      if(!this.mod) return 0;
      return numErrorsForMod(this.mod);
    },

    validTestProps() {
      return this.settings.level > 0 && this.settings.map && this.settings.x > 0 && this.settings.y > 0;
    },

    validOtherProps() {
      try {
        JSON.parse(this.settings.otherProps);
        return true;
      } catch {
        return false;
      }
    }
  },

  methods: {
    testModModal() {
      this.$refs.modal.show();
    },

    highlighter(code) {
      return highlight(code, languages.json);
    },

    testMod() {
      const settings = JSON.stringify({
        level: this.settings.level,
        map: this.settings.map,
        x: +this.settings.x,
        y: +this.settings.y,
        ...JSON.parse(this.settings.otherProps)
      });

      window.api.send('TEST_MOD', { mod: this.mod, map: this.settings.map, settings, openClient: this.settings.openClient });

      this.persist();
    },

    killMod() {
      window.api.send('KILL_MOD');
    },

    async loadSettings() {
      const settings = await localforage.getItem('modtestsettings');
      if(settings) {
        try {
          this.settings = JSON.parse(settings);
        } catch {
          this.settings = {
            level: 1,
            map: '',
            x: 0,
            y: 0,
            openClient: true,
            otherProps: '{\n  \n}'
          };
        }
      }
    },

    persist() {
      localforage.setItem('modtestsettings', JSON.stringify(this.settings));
    }
  }
};
</script>

<style scoped>
  .code-editor {
    max-height: 240px;
  }
</style>
