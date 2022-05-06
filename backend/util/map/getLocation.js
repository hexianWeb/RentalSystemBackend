import { secretKey } from "../../config/default.js";
import axios from "axios";
export async function getLocation(address) {
  const encodedURI = encodeURI(
    `https://apis.map.qq.com/ws/geocoder/v1/?address=${address}&key=${secretKey}`
  );
  let info = await axios.get(encodedURI).then((res) => {
    if (res.data.status == 0) {
      //   console.log(res.data.result.location);
      const { lat, lng } = res.data.result.location;
      //   console.log(lat);
      return {
        map_lat: lat,
        map_lng: lng,
      };
    } else {
      getLocation(address);
      res.cc("重新发送");
    }
  });
  return info;
}
// let res = await getLocation("江西省南昌市经开区双港东大街802号");
// console.dir(res);
