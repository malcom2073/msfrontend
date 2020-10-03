import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

import { create } from 'apisauce'


const postsDirectory = path.join(process.cwd(), 'posts')

export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const postIdList = await getAllPostIds();
  const allPostsData = postIdList.map(fileName => {
    // Remove ".md" from file name to get id
    //const id = fileName.replace(/\.md$/, '')
    console.log('Filename:');
    console.log(fileName);
    const id = fileName.params.ids;

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, id + '.md')
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}
export async function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    const api = create({
      baseURL: 'http://localhost:5000',
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    const response = await api.get('/getAllPostIds');
    console.log(response.data)
    return response.data;
    return fileNames.map(fileName => {
      return {
        params: {
          ids: fileName.replace(/\.md$/, '')
        }
      }
    })
  }
  export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
  
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()
  
    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data
    }
  }
  
  