<template>
  <div>
    <b-dropdown-item @click="validate()">Validate Mod</b-dropdown-item>

    <b-modal
      size="lg"
      ref="modal"
      title="Validate Mod"
      ok-title="Confirm"
      ok-only
    >
      <div class="d-block p-1">
        <div class="row">
          <div
class="col-3"
v-for="(value, key) in totals"
:key="key"
>
            <span :class="key" />
            {{ value }}
          </div>
        </div>

        <div class="row">
          <div class="col">
            <hr>
          </div>
        </div>

        <div class="row">
          <div class="col scroll-container">
            <div
class="row"
v-for="(valid, index) of validations"
:key="index"
>
              <div class="col">
                <h3
v-if="valid.header"
class="header"
>{{ valid.header }}</h3>
                <h5
v-if="valid.subheader"
class="subheader"
>
                  {{ valid.subheader }}
                </h5>
                <div>
                  <span :class="valid.type" />
                  {{ valid.message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { validationMessagesForMod } from '../../helpers';

export default {
  name: 'ModValidator',

  props: ['mod'],

  data() {
    return {
      validations: [],
      totals: { warning: 0, error: 0, good: 0, whatever: 0 },
    };
  },

  methods: {
    validate() {
      this.totals = { warning: 0, error: 0, good: 0, whatever: 0 };
      this.validations = validationMessagesForMod(this.mod);

      this.validations.forEach((vdn) => {
        if (!vdn.type) return;

        this.totals[vdn.type]++;
      });

      this.$refs.modal.show();
    },
  },
};
</script>

<style scoped>
.scroll-container {
  max-height: 500px;
  overflow-y: scroll;
}

.header {
  margin-top: 5px;
  margin-bottom: 5px;
}

.subheader {
  margin-top: 15px;
  margin-bottom: 15px;
}

span.warning::before {
  content: '⚠️ ';
}

span.error::before {
  content: '🚫 ';
}

span.whatever::before {
  content: '🤷 ';
}

span.good::before {
  content: '✅ ';
}
</style>
