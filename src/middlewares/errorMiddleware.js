import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
const errorHandlingMiddleware = (err, req, res, next) => {
  // Nếu dev không cẩn thận thiếu status thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.status) err.status = StatusCodes.INTERNAL_SERVER_ERROR

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    status: err.status,
    message: err.message || StatusCodes[err.status], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack
  }
  // console.error(responseError)

  // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi.
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
  // ...
  // console.error(responseError)

  // Trả responseError về phía Front-end
  res.status(responseError.status).json(responseError)
}

module.exports = {
  errorHandlingMiddleware
}
