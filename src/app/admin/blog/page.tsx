import { BlogManager } from "@/components/admin/BlogManager";
import { listBlogPosts } from "@/lib/store/repo";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const posts = await listBlogPosts();
  return <BlogManager posts={posts} />;
}
