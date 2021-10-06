import fs from "fs"
import path from "path"
import Pagination from "@/components/Pagination";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import { POSTS_PER_PAGE } from "@/config/index";
import CategoryList from '@/components/CategoryList'
import { getPosts } from "@/lib/posts";


export const getStaticPaths = async()=>{
    const files = fs.readdirSync(path.join('posts'))
    const numPages = Math.ceil(files.length / POSTS_PER_PAGE)

    const paths = []

    for(let i=1; i <= numPages; i++)
    {
        paths.push({
            params:{
                page_index: i.toString()
            }
        })
    }

    console.log(paths)
    return{
        paths,
        fallback:false
    }
}

export const getStaticProps = async({params})=>{

    const page = parseInt((params && params.page_index) || 1 )
    const files = fs.readdirSync(path.join('posts'))

    const posts = getPosts()

    const categories = posts.map((post)=>post.frontmatter.category)

    const uniqueCategories = [...new Set(categories)]

    // console.log(uniqueCategories)

    // console.log(posts)

    const numPages = Math.ceil(files.length / POSTS_PER_PAGE)
    const pageIndex = page - 1
    const orderedPosts = posts.slice(pageIndex*POSTS_PER_PAGE,(pageIndex + 1)*POSTS_PER_PAGE)
    return{
      props:{
        posts:orderedPosts,
        numPages,
        currentPage:page,
        categories : uniqueCategories
      }
    }
}

export default function BlogPage({posts,numPages,currentPage,categories}) {
  return (
    <Layout>
    <div className='flex justify-between flex-col md:flex-row'>
      <div className='w-3/4 mr-10'>
        <h1 className='text-5xl border-b-4 p-5 font-bold'>Blog</h1>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {posts.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </div>

        <Pagination currentPage={currentPage} numPages={numPages} />
      </div>

      <div className='w-1/4'>
        <CategoryList categories={categories} />
      </div>
    </div>
  </Layout>
  )
}
