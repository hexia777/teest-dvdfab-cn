/**
 * 移除 sourcemap
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const rootDir = path.join('./.output', 'public/_nuxt3')

try {
  const files = await fs.readdir(rootDir)
  files.forEach(async (file) => {
    if (path.extname(file) === '.map') {
      // 清空文件
      const filePath = path.join(rootDir, file)
      await fs.writeFile(filePath, '')
    }
  })

  console.log('[PostBuild] sourcemap is already removed.\n')

} catch (err) {
  console.log('[PostBuild]', err, '\n')
}
