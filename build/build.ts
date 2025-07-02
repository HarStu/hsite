import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const mdDir = path.resolve(__dirname, '../md')
const files = await fs.readdir(mdDir)

const templatePath = path.resolve(__dirname, '../templates/template.html')
const template = await fs.readFile(templatePath, 'utf-8')

const distDir = path.resolve(__dirname, '../dist/')
await fs.mkdir(distDir, { recursive: true })

const srcCss = path.resolve(__dirname, '../templates/styles.css')
const distCss = path.resolve(__dirname, '../dist/styles.css')
await fs.copyFile(srcCss, distCss)

for (const file of files) {
  if (!file.endsWith('.md')) {
    console.log('non-markdown file')
    continue
  }

  const raw = await fs.readFile(path.join(mdDir, file), 'utf-8')
  const { content, data } = matter(raw)

  const html = md.render(content)

  const filledHtml = template
    .replace('{{header}}', data.title ?? file.replace(/\.md$/, ''))
    .replace('{{content}}', html)

  const slug = file.replace(/\.md$/, '')
  const outPath = path.join(distDir, `${slug}.html`)
  await fs.writeFile(outPath, filledHtml, 'utf-8')

  console.log({
    slug,
    frontmatter: data,
  })


}