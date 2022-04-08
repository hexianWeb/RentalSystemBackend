// ids是用来维护NoSQL中缺少自增id功能的一张表
import mongoose from "mongoose";

const idsSchema = new mongoose.Schema({
  user_id: Number,
  admin_id: Number,
  img_id: Number,
  estate_id: Number,
  house_id: Number,
});

const Ids = mongoose.model("Ids", idsSchema);

Ids.findOne((err, data) => {
  if (!data) {
    const newIds = new Ids({
      user_id: 10,
      admin_id: 9,
      img_id: 45,
      estate_id: 7,
      house_id: 0,
    });
    newIds.save();
  }
});

export default Ids;
