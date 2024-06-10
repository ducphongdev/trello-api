const { taskItemModel } = require('~/models/taskItemModel')

const getBadgeData = async (card) => {
  try {
    // Ví dụ truy vấn từ các bảng khác
    const taskItems = await taskItemModel.countDocument(card._id)
    const taskItemsChecked = await taskItemModel.countDocumentComplete(card._id)
    const start = card.start
    const due = card.due
    const dueComplete = card.dueComplete
    const description = Boolean(card.description)
    return {
      taskItems,
      taskItemsChecked,
      start,
      due,
      dueComplete,
      description
    }
  } catch (error) {
    throw new Error('Error fetching badge data')
  }
}

module.exports = {
  getBadgeData
}
