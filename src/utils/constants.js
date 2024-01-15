// Những domain được phép truy cập tới tài nguyên server
const WHITELIST_DOMAINS = [
  'http://localhost:3000',
  'http://localhost',
  'http://127.0.0.1'
]

const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export {
  WHITELIST_DOMAINS,
  BOARD_TYPES
}