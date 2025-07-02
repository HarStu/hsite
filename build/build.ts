import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const mdDir = path.resolve(__dirname, '../md')
const files = await fs.readdir(mdDir)

for (const file of mdDir) {
  if (!file.endsWith('.md')) {
    console.log('non-markdown file')
    continue
  }

  const raw = await fs.readFile(path.join(mdDir, file), 'utf-8')
  const { content, data } = matter(raw)

  const html = md.render(content)

  console.log({
    slug: file.replace(/\.md$/, ''),
    frontmatter: data,
    html
  })

}