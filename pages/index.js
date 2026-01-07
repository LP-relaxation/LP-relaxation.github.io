import Head from 'next/head';
import styles from '../styles/Home.module.css';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function Home({ posts }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>LP Relaxes</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <h1 className={styles.title}>
          LP Relaxes
        </h1>
        <p className={styles.description}>
          (And writes sometimes.)
        </p>

        <p className={styles.about}>
    Hi. I'm an applied researcher and engineer, nicknamed "LP" in grad school because my initials match the abbreviation for <a href="https://en.wikipedia.org/wiki/Linear_programming"> Linear Programming.</a> 
    
    I try to apply <a href="https://en.wikipedia.org/wiki/Linear_programming_relaxation">LP relaxations</a> 

    as a philosophy in all aspects of life: start small and imperfect, and if you can't solve a hard problem yet, solve an easier version first.

  </p>
        
    <div className={styles.grid}>
      {posts.map((post) => (
        <a href={`/blog/${post.slug}`} className={styles.card} key={post.slug}>
          {post.frontmatter.image && (
            <img 
              src={post.frontmatter.image} 
              alt={post.frontmatter.title}
              className={styles.cardImage}
            />
          )}
          <h2>{post.frontmatter.title} &rarr;</h2>
          <p><i>{post.frontmatter.description}</i></p>
          <p>{post.frontmatter.date}</p>
        </a>
      ))}
    </div>
      </main>
<footer>
  <p> Blog by LP. Template by <a href="https://github.com/vercel/next-learn/tree/main/basics/learn-starter" target="_blank" rel="noopener noreferrer">Vercel.</a> </p>
</footer>
<style jsx>{`
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 100%;
  }
  
  footer {
    width: 100%;
    height: auto;  /* Changed from 100px */
    min-height: 100px;
    border-top: 1px solid #eaeaea;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 1rem 1.5rem;
  }
  
  footer p {
    margin: 0;
    text-align: center;
  }
  
  footer a {
    display: inline;
    text-decoration: none;
    color: inherit;
  }
  
  /* Desktop styles */
  @media (min-width: 769px) {
    footer {
      flex-wrap: nowrap;
      white-space: nowrap;
      padding: 0 2rem;
    }
  }
`}</style>

<style jsx global>{`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  
  * {
    box-sizing: border-box;
  }
`}</style>
    </div>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('posts'));
  
  const posts = files
    .filter(filename => filename.endsWith('.html') || filename.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace(/\.(html|md)$/, '');
      const fileContent = fs.readFileSync(
        path.join('posts', filename),
        'utf-8'
      );
      const { data: frontmatter } = matter(fileContent);
      
      return {
        slug,
        frontmatter: {
          ...frontmatter,
          date: frontmatter.date ? frontmatter.date.toString() : '',
          pinned: frontmatter.pinned || false  // Add this line
        }
      };
    });
  
  // Sort: pinned posts first, then by date
  const sortedPosts = posts.sort((a, b) => {
    if (a.frontmatter.pinned && !b.frontmatter.pinned) return -1;
    if (!a.frontmatter.pinned && b.frontmatter.pinned) return 1;
    // Optional: sort non-pinned by date
    return 0;
  });
  
  return {
    props: {
      posts: sortedPosts
    }
  };
}