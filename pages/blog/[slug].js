import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { marked } from 'marked';

<style jsx global>{`
  html {
    font-size: 120%;
  }
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  * {
    box-sizing: border-box;
  }
`}</style>

export default function BlogPost({ frontmatter, htmlContent }) {
  return (
    <div className={styles.container}>
    <Head>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
      />
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
      ></script>
      <script
        defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
        onLoad="renderMathInElement(document.body);"
      ></script>
    </Head>
      
      <main>
        
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        
        <a href="/" className={styles.card}>
          ← Back to home
        </a>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
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

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));
  
  const paths = files
    .filter(filename => filename.endsWith('.html') || filename.endsWith('.md'))
    .map(filename => ({
      params: {
        slug: filename.replace(/\.(html|md)$/, '')
      }
    }));
  
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params: { slug } }) {
  // Check which file exists
  let filePath;
  let isMarkdown = false;
  
  if (fs.existsSync(path.join('posts', `${slug}.html`))) {
    filePath = path.join('posts', `${slug}.html`);
  } else if (fs.existsSync(path.join('posts', `${slug}.md`))) {
    filePath = path.join('posts', `${slug}.md`);
    isMarkdown = true;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  
  // Convert markdown to HTML if needed
  const htmlContent = isMarkdown ? marked(content) : content;
  
  return {
    props: {
      frontmatter: JSON.parse(JSON.stringify(frontmatter)),
      htmlContent
    }
  };
}