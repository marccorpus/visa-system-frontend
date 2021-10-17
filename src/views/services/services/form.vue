<template>
  <el-container>
    <el-main class="the-main">
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="serviceForm"
        label-position="top"
        size="small"
      >
        <el-card :body-style="bodyStyle">
          <div slot="header" class="clearfix">
            <span>Details</span>
          </div>

          <el-form-item label="Service Type" prop="type">
            <el-select
              v-model="form.type"
              placeholder="Select"
              class="full-width"
              :disabled="title == 'Edit Service'"
            >
              <el-option
                v-for="serviceType in serviceTypes"
                :key="serviceType.id"
                :label="serviceType.label"
                :value="serviceType.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.type == 'child'"
            label="Service Parent"
            prop="parent_service_id"
          >
            <el-select
              v-model="form.parent_service_id"
              placeholder="Select"
              class="full-width"
            >
              <el-option
                v-for="parentService in parentServices"
                :key="parentService.id"
                :label="parentService.name"
                :value="parentService.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Service Name" prop="name" :error="errors.name">
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="Enter service name"
            ></el-input>
          </el-form-item>
        </el-card>

        <template v-if="form.type == 'child'">
          <el-card :body-style="bodyStyle" class="m-t-12">
            <div slot="header" class="clearfix">
              <span>Processing Time</span>
            </div>

            <el-form-item label="Type" prop="processing_type">
              <el-select
                v-model="form.processing_type"
                placeholder="Select"
                class="full-width"
              >
                <el-option
                  v-for="processingType in processingTypes"
                  :key="processingType.id"
                  :label="processingType.label"
                  :value="processingType.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.processing_type == 'fix'"
              label="Number of Days"
              prop="processing_days"
            >
              <el-input
                v-model="form.processing_days"
                type="number"
                min="1"
                autocomplete="off"
                placeholder="Enter number of days"
              ></el-input>
            </el-form-item>
            <el-row :gutter="20" v-if="form.processing_type == 'range'">
              <el-col :span="12">
                <el-form-item
                  label="Minimum Number of Days"
                  prop="processing_minimum_days"
                >
                  <el-input
                    v-model="form.processing_minimum_days"
                    type="number"
                    min="1"
                    autocomplete="off"
                    placeholder="Enter minimum number of days"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="Maximum Number of Days"
                  prop="processing_maximum_days"
                >
                  <el-input
                    v-model="form.processing_maximum_days"
                    type="number"
                    min="1"
                    autocomplete="off"
                    placeholder="Enter maximum number of days"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <el-card :body-style="bodyStyle" class="m-t-12">
            <div slot="header" class="clearfix">
              <span>Rates</span>
            </div>

            <template v-for="(rate, index) in form.rates">
              <el-row :gutter="20" :key="rate.id">
                <el-col :span="4">
                  <el-form-item :label="rate.name + ':'"></el-form-item
                ></el-col>
                <el-col :span="5">
                  <el-form-item
                    label="Cost"
                    :prop="'rates.' + index + '.cost'"
                    :rules="rules.rates.cost"
                  >
                    <el-input
                      v-model.number="rate.cost"
                      autocomplete="off"
                      min="0"
                      placeholder="Enter cost"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    label="Under"
                    :prop="'rates.' + index + '.under'"
                    :rules="rules.rates.under"
                  >
                    <el-input
                      v-model.number="rate.under"
                      autocomplete="off"
                      min="0"
                      placeholder="Enter under"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    label="Charge"
                    :prop="'rates.' + index + '.charge'"
                    :rules="rules.rates.charge"
                  >
                    <el-input
                      v-model.number="rate.charge"
                      autocomplete="off"
                      min="0"
                      placeholder="Enter charge"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="Total">
                    <el-input
                      autocomplete="off"
                      disabled
                      :value="total(rate.cost, rate.under, rate.charge)"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-card>

          <el-card :body-style="bodyStyle" class="m-t-12">
            <div slot="header" class="clearfix">
              <span>Documents</span>
            </div>

            <el-form-item
              label="Documents to be Receive"
              prop="documents_to_be_receive"
            >
              <el-select
                v-model="form.documents_to_be_receive"
                multiple
                placeholder="Select"
                class="full-width"
              >
                <el-option
                  v-for="document in documents"
                  :key="document.id"
                  :label="document.name"
                  :value="document.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="Documents to be Release"
              prop="documents_to_be_release"
            >
              <el-select
                v-model="form.documents_to_be_release"
                multiple
                placeholder="Select"
                class="full-width"
              >
                <el-option
                  v-for="document in documents"
                  :key="document.id"
                  :label="document.name"
                  :value="document.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-card>
        </template>
      </el-form>
    </el-main>

    <el-footer class="form-footer">
      <el-card :body-style="bodyStyle">
        <el-row>
          <el-col :span="24">
            <el-button
              size="small"
              icon="el-icon-circle-close"
              @click="$emit('go-to-services')"
              >Cancel</el-button
            >
            <el-button
              type="primary"
              size="small"
              icon="el-icon-circle-check"
              :loading="loading"
              @click="save"
              >Save</el-button
            >
          </el-col>
        </el-row>
      </el-card>
    </el-footer>
  </el-container>
</template>

<script>
import { moneyFormat } from "@/utils/index";

export default {
  name: "ServicesForm",
  props: [
    "loading",
    "title",
    "parentServices",
    "rates",
    "documents",
    "form",
    "errors"
  ],
  data() {
    var validateName = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("The service name field is required."));
      } else if (value.trim().length > 255) {
        callback(
          new Error("The service name must not be greater than 255 characters.")
        );
      } else {
        callback();
      }
    };
    var validateType = (rule, value, callback) => {
      if (!value) {
        callback(new Error("The service type field is required."));
      } else {
        callback();
      }
    };
    var validateParentServiceId = (rule, value, callback) => {
      if (!value) {
        callback(new Error("The service parent field is required."));
      } else {
        callback();
      }
    };
    var validateProcessingDays = (rule, value, callback) => {
      let label = "";
      if (rule.field == "processing_days") {
        label = "number of days";
      } else if (rule.field == "processing_minimum_days") {
        label = "minimum number of days";
      } else if (rule.field == "processing_maximum_days") {
        label = "maximum number of days";
      }

      if (!value) {
        callback(new Error(`The ${label} field is required.`));
      } else if (value < 1) {
        callback(new Error(`The ${label} must be greater than 0.`));
      } else if (value % 1 != 0) {
        callback(new Error(`The ${label} must be an integer.`));
      } else {
        callback();
      }
    };

    return {
      serviceTypes: [
        { id: 1, label: "Parent", value: "parent" },
        { id: 2, label: "Child", value: "child" }
      ],
      processingTypes: [
        { id: 1, label: "Not applicable", value: null },
        { id: 2, label: "Same day", value: "same day" },
        { id: 3, label: "Fix", value: "fix" },
        { id: 4, label: "Range", value: "range" }
      ],

      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        type: [{ required: true, validator: validateType, trigger: "blur" }],
        parent_service_id: [
          {
            required: true,
            validator: validateParentServiceId,
            trigger: "blur"
          }
        ],
        processing_days: [
          { required: true, validator: validateProcessingDays, trigger: "blur" }
        ],
        processing_minimum_days: [
          { required: true, validator: validateProcessingDays, trigger: "blur" }
        ],
        processing_maximum_days: [
          { required: true, validator: validateProcessingDays, trigger: "blur" }
        ],
        rates: {
          cost: [
            {
              type: "number",
              message: "The cost must be digits."
            }
          ],
          under: [
            {
              type: "number",
              message: "The under must be digits."
            }
          ],
          charge: [
            {
              type: "number",
              message: "The charge must be digits."
            }
          ]
        }
      }
    };
  },
  methods: {
    save() {
      this.$emit("set-loading", true);

      this.$refs["serviceForm"].validate(valid => {
        if (valid) {
          this.$emit("reset-errors");

          this.$emit("save", this.form);
        } else {
          this.$emit("set-loading", false);

          this.$emit("scroll-to-top");

          this.$emit("show-notification", {
            title: "Error",
            message: "Please check your inputs.",
            type: "error"
          });

          return false;
        }
      });
    },
    total(cost, under, charge) {
      return moneyFormat(
        (parseFloat(cost) + parseFloat(under) + parseFloat(charge)).toFixed(2)
      );
    }
  },
  computed: {
    bodyStyle() {
      return { padding: "10px" };
    }
  }
};
</script>

<style lang="scss" scoped>
.form-footer {
  margin-bottom: 14px;
  text-align: right;
}
.full-width {
  width: 100%;
}
.m-t-12 {
  margin-top: 12px;
}
.the-main {
  margin-top: -15px;
  padding-bottom: 12px;
}
</style>
