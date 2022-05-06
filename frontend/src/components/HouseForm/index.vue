<template>
  <el-form :model="form.data" label-width="120px" :inline="true">
    <el-form-item label="房屋名称">
      <el-input v-model="form.data.title" />
    </el-form-item>
    <br />
    <el-form-item label="每月租金">
      <el-input v-model="form.data.rent" />
    </el-form-item>
    <el-form-item label="占用面积">
      <el-input v-model="form.data.useArea" />
    </el-form-item>
    <el-form-item label="具体楼层">
      <el-input-number v-model="form.data.floor" :min="1" :max="10" />
    </el-form-item>
    <br />
    <el-form-item label="南北朝向">
      <el-radio-group v-model="form.data.orientataion">
        <el-radio label="南" size="large">南</el-radio>
        <el-radio label="北" size="large">北</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="租赁方式">
      <el-radio-group v-model="form.data.rentMethod">
        <el-radio label="押一付一" size="large">押一付一</el-radio>
        <el-radio label="押一付三" size="large">押一付三</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="租房手段">
      <el-radio-group v-model="form.data.paymentMethod">
        <el-radio label="整租" size="large">整租</el-radio>
        <el-radio label="合租" size="large">合租</el-radio>
        <el-radio label="短租" size="large" disabled>短租</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="基础设施">
      <el-checkbox-group v-model="form.data.type">
        <el-checkbox label="电视" name="type" />
        <el-checkbox label="宽带" name="type" />
        <el-checkbox label="床铺" name="type" />
        <el-checkbox label="冰箱" name="type" />
        <el-checkbox label="卫生间" name="type" />
        <el-checkbox label="空调" name="type" />
        <el-checkbox label="洗衣机" name="type" />
        <el-checkbox label="油烟机" name="type" />
        <el-checkbox label="衣柜" name="type" />
        <el-checkbox label="阳台" name="type" />
        <el-checkbox label="沙发" name="type" />
        <el-checkbox label="智能门锁" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="房源图片">
      <el-upload
        class="avatar-uploader"
        action="http://localhost:3001/api/house/uploadHouseImg"
        :show-file-list="false"
        :on-success="handleHouseImg"
        :before-upload="beforeImgUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onClose">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { reactive, ref, onMounted, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

export default {
  name: "HouseForm",
  props: ["estate_id", "operateForm"],
  components: { Plus },
  setup(props, { emit }) {
    // 图片绑定
    const imageUrl = ref("");
    // 表单数据
    const form = reactive({
      data: {
        title: "",
        rent: "",
        useArea: "",
        floor: 1,
        orientataion: "",
        rentMethod: "",
        paymentMethod: "",
        type: [],
        pic: "",
        estate_id: "",
      },
    });
    onMounted(() => {
      let tmp = toRaw(props.operateForm.data.housetype);
      form.data = props.operateForm.data;
      form.data.type = tmp;
      imageUrl.value = encodeURI(
        `http://localhost:3001/img/${props.operateForm.data.pic}`
      );
    });
    // 子组件想父组件传递
    function onSubmit() {
      form.data.estate_id = props.estate_id;
      emit("submitForm", form);
    }
    function onClose() {
      emit("closeForm");
    }
    // 图片上传
    function beforeImgUpload(file) {
      isFileValid(file);
    }
    // 图片返回
    function handleHouseImg(res, file) {
      ElMessage.success("图片上传成功");
      imageUrl.value = encodeURI(`http://localhost:3001/img/${res.image_path}`);
      form.data.pic = res.image_path;
    }
    // 照片判断
    function isFileValid(file) {
      const type = file.type.split("/").pop();
      const size = file.size;
      const vaildTypes = ["jpg", "jpeg", "png"];
      if (vaildTypes.indexOf(type) === -1) {
        ElMessage.error("图片格式不正确");
        return false;
      } else if (size / 1024 / 1024 > 5) {
        ElMessage.error("图片不宜超过5MB");
        return false;
      }
      return true;
    }
    return {
      imageUrl,
      form,
      beforeImgUpload,
      handleHouseImg,
      onSubmit,
      onClose,
    };
  },
};
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
