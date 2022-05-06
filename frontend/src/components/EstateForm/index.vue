<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="地产名称">
      <el-input v-model="form.estate_title" />
    </el-form-item>
    <el-form-item label="地产所在省份">
      <!-- 地区三级联动 -->
      <el-cascader
        size="large"
        :options="options.info"
        v-model="form.selectedOptions"
        @change="handleChange"
      >
      </el-cascader>
    </el-form-item>
    <el-form-item label="具体地址">
      <el-input v-model="form.address" />
    </el-form-item>
    <el-form-item label="开盘时间">
      <el-col :span="11">
        <el-date-picker
          v-model="form.created"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="是否立即上架">
      <el-switch v-model="form.delivery" />
    </el-form-item>
    <el-form-item label="房源特点">
      <el-checkbox-group v-model="form.type">
        <el-checkbox label="近地铁" name="type" />
        <el-checkbox label="当前在售" name="type" />
        <el-checkbox label="成熟商圈" name="type" />
        <el-checkbox label="配套齐全" name="type" />
        <el-checkbox label="临近高速" name="type" />
        <el-checkbox label="南北通透" name="type" />
        <el-checkbox label="精装修" name="type" />
        <el-checkbox label="在线签约" name="type" />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="地区描述">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onClose">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  onMounted,
  reactive,
  ref,
  toRaw,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import { regionData, CodeToText } from "element-china-area-data";
import moment from "moment";
export default {
  props: ["operateForm", "operateType"],
  name: "EstateForm",
  setup(props, { emit }) {
    // 中国三级地理列表
    const options = reactive({
      info: [],
    });
    options.info = regionData;
    onMounted(() => {
      console.log("1");
      const data = toRaw(props.operateForm);
      form.estate_title = data.estate_title;
      form.selectedOptions = data.selectedOptions;
      form.address = data.address;
      form.created = new Date();
      form.type = data.type;
      form.desc = data.desc;
      form.province = data.province;
      form.city = data.city;
      form.area = data.area;
    });
    const form = reactive({
      estate_title: "",
      province: "",
      city: "",
      area: "",
      selectedOptions: [],
      address: "",
      created: "",
      type: [],
      desc: "",
      estate_id: "",
    });
    function handleChange(value) {
      form.province = CodeToText[value[0]];
      form.city = CodeToText[value[1]];
      form.area = CodeToText[value[2]];
    }
    function onSubmit() {
      var d = new Date(form.created);
      var datetime =
        d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
      form.created = datetime;
      if (props.operateType == "edit") {
        form.estate_id = props.operateForm.estate_id;
      }
      emit("submitForm", form);
    }
    function onClose() {
      emit("closeForm");
    }
    return { form, options, handleChange, onClose, onSubmit };
  },
};
</script>
