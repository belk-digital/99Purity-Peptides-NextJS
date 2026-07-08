// @ts-nocheck
import { BLOG_POSTS_PART1 } from './blog-posts.es.part1'
import { BLOG_POSTS_PART2 } from './blog-posts.es.part2'
import { BLOG_POSTS_PART3 } from './blog-posts.es.part3'
import { MOCK_IMAGES } from './blog-posts'

export const CATEGORIES = ['Ver todo', 'Investigación de crecimiento', 'Estudios musculares', 'Protocolos de recuperación', 'Investigación metabólica']

export { MOCK_IMAGES }

export const BLOG_POSTS: typeof import('./blog-posts').BLOG_POSTS = [
  ...BLOG_POSTS_PART1,
  ...BLOG_POSTS_PART2,
  ...BLOG_POSTS_PART3,
]
