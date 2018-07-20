export default function formatDate(date) {
  const val = new Date(date)

  return val.getMonth() + 1 + '/' + val.getDate() + '/' + val.getFullYear()
}
