<template>
  <el-form
    :model="form"
    status-icon
    :rules="rules"
    ref="form"
    label-position="top"
    size="small"
  >
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form-item label="Service" prop="service">
          <el-select
            v-model="form.service"
            placeholder="Select"
            class="full-width"
            size="mini"
            filterable
            value-key="id"
          >
            <el-option-group
              v-for="parentService in services"
              :key="parentService.id"
              :label="parentService.name"
            >
              <el-option
                v-for="service in parentService.services"
                :key="service.id"
                :label="`[${parentService.name}] ${service.name}`"
                :value="service"
              >
                {{ service.name }}
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="Clients" prop="clients">
          <el-select
            v-model="form.clients"
            placeholder="Select"
            class="full-width"
            size="mini"
            multiple
            filterable
            value-key="id"
          >
            <el-option
              v-for="member in members"
              :key="member.id"
              :label="`${member.first_name} ${member.last_name}`"
              :value="member"
            >
              {{ member.first_name + " " + member.last_name }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            class="add-btn"
            @click="add"
            >Add</el-button
          >
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { indexWithRates as _servicesIndexWithRates } from "@/api/service";
import { members as _groupsMembers } from "@/api/group";

export default {
  name: "GroupCreateTransactionAddServicesForm",
  props: ["id"],
  data() {
    return {
      services: [],
      members: [],

      form: {
        service: null,
        clients: []
      },
      rules: {
        service: [
          {
            required: true,
            trigger: "change",
            message: "The service field is required."
          }
        ],
        clients: [
          {
            required: true,
            trigger: "change",
            message: "The clients field is required."
          }
        ]
      }
    };
  },
  methods: {
    getServices() {
      _servicesIndexWithRates()
        .then(response => {
          let temp = [];

          const parentServices = response.data.data.parent_services;
          parentServices.forEach(parentService => {
            let parent = {
              id: parentService.id,
              name: parentService.name,
              services: []
            };

            parentService.services.forEach(service => {
              let cost = 0;
              let under = 0;
              let charge = 0;
              if (service.rates.length == 1) {
                cost = service.rates[0].pivot.cost;
                under = service.rates[0].pivot.under;
                charge = service.rates[0].pivot.charge;
              }

              let child = {
                id: service.id,
                name: service.name,
                parent_service_name: parentService.name,
                cost,
                under,
                charge
              };

              parent["services"].push(child);
            });

            temp.push(parent);
          });

          this.services = temp;
        })
        .catch(() => {});
    },
    getMembers() {
      _groupsMembers(this.id)
        .then(response => {
          this.members = response.data.data.members.map(m => {
            return {
              id: m.id,
              first_name: m.first_name,
              last_name: m.last_name
            };
          });
        })
        .catch(() => {});
    },
    add() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let services = [];

          const { service, clients } = { ...this.form };

          clients.forEach(client => {
            services.push({
              id: service.id,
              service_name: service.name,
              parent_service_name: service.parent_service_name,
              client_id: client.id,
              client_name: client.first_name + " " + client.last_name,
              group_id: this.id,
              cost: service.cost,
              under: service.under,
              charge: service.charge,
              status: "Pending"
            });
          });

          this.$emit("add-services", services);

          this.$refs["form"].resetFields();
        }
      });
    }
  },
  created() {
    this.getServices();
    this.getMembers();
  }
};
</script>

<style lang="scss" scoped>
.add-btn {
  margin-top: 45px;
  float: right;
  width: 100%;
}
.full-width {
  width: 100%;
}
</style>
