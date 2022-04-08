import chalk from "chalk";
import gm from "gm";

// 且图片工具类
export function cutPic(path, size) {
  gm(path)
    .resize(size, size)
    .write(path, async (err) => {
      if (err) {
        console.log(chalk.red(err.message));
      }
    });
}
