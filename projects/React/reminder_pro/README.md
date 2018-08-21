- 导入根目录的 css，可以作用到子组件
- sfcookies 包操作 cookies
  - Application-Cookies

# Deploy

```bash
cd /etc/nginx/conf.d
sudo vi reminder.conf

server {
    listen 80;
    server_name reminder.hofungkoeng.com;
    root /home/slackbuffer/reminder_pro/build;
    index index.html;
}
```