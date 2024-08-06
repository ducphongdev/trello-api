/**
 * Định nghĩa riêng một Class ApiError kế thừa class Error sẵn (điều này cần thiết và là Best Practice vì class Error nó là class built-in sẵn)
 */
class ApiError extends Error {
  constructor(status, message) {
    // Gọi tới hàm khởi tạo của class Error (class cha) để còn dùng this (kiến thức OOP lập trình hướng đối tượng căn bản)
    // Thằng cha (Error) có property message rồi nên gọi nó luôn trong super cho gọn
    super(message)

    this.name = 'Máy chủ đang bận'

    this.status = status

    // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug - gỡ lỗi
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
