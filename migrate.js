const path = require('path')
const sqlite = require('sqlite')

async function main () {
  const db = await sqlite.open(path.join(__dirname, 'database.sqlite3'))
  return db.migrate({force: 'last'})
}

main().then(() => {
  console.log('Migrated successfully!')
}).catch((err) => {
  console.error(err)
})