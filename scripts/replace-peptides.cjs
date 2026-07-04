const fs = require('fs')
const path = require('path')
function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file))
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file)
      }
    }
  })
  return results
}
const files = walk('./src')
let count = 0
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8')
  if (content.includes('peptides7.com')) {
    content = content.replace(/peptides7\.com/g, '99puritypeptides.com')
    fs.writeFileSync(f, content, 'utf8')
    console.log('Updated ' + f)
    count++
  }
})
console.log('Updated ' + count + ' files.')
