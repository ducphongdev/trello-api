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

const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

const STATE_TASKITEM = {
  INCOMPLETE: 'incomplete',
  COMPLETE: 'complete'
}

const TOKEN_TIME = {
  ACCESS_TOKE: '2h',
  REFRESH_TOKE: '2h'
}

export {
  WHITELIST_DOMAINS,
  BOARD_TYPES,
  USER_ROLES,
  TOKEN_TIME,
  STATE_TASKITEM
}