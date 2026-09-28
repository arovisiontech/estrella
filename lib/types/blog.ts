export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  author_name: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  meta_title?: string;
  meta_description?: string;
  reading_time?: number;
};
