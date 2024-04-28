```bash
#!/bin/bash

#安装imagemagick工具
apt install imagemagick -y

# 设置图片参数
width=600
height=800
background_color="lightblue"
text_color="white"
output_file="opendesk_image_imagemagick.png"
text="OpenDesk"

# 生成图片
convert -size ${width}x${height} xc:${background_color} -fill ${text_color} \
          -gravity center -pointsize 48 -annotate +0+0 "${text}" ${output_file}

echo "图片已生成：${output_file}"
```
