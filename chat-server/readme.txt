nest new chat-server
npm i @nestjs/websockets @nestjs/platform-socket.io
nest g resource messages

* emit là phương thức được sử dụng để gửi dữ liệu từ máy chủ đến các máy khách đã kết nối. Phương thức này có hai tham số:

event: Tên của sự kiện.
data: Dữ liệu được gửi.