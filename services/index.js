import{request, gql} from 'graphql-request';
// import { server } from '../config';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async()=>{
    const query = gql`
    query MyQuery {
      postsConnection(orderBy: createdAt_DESC) {
        edges {
          cursor
          node {
            author {
              id
              name
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
        pageInfo {
          startCursor
          hasPreviousPage
          hasNextPage
          endCursor
          pageSize
        }
        aggregate {
          count
        }
      }
    }
    

    `
    const result = await request(graphqlAPI, query)
    return result.postsConnection;
    //return result.postsConnection.edges;
};

export const getPostDetails = async(slug)=>{
  const query = gql`
  query GetPostDetails($slug: String!){
    post(where: {slug: $slug}) {
      author {
        name
        id
        bio
        photo {
          url
        }
      }
      createdAt
      slug
      title
      excerpt
      featuredImage {
        url
      }
      categories {
        name
        slug
      }
      content{
        raw
      }
    }
  }
  `
  const result = await request(graphqlAPI, query, {slug})
  return result.post;
};




export const getRecentPosts = async () => {
  const query = gql`
    query GetPostDetails() {
      posts(
        orderBy: createdAt_ASC
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  //why is result undefined???
  const result = await request(graphqlAPI, query);

  return result.posts;
};

export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  const result = await request(graphqlAPI, query, { slug, categories });

  return result.posts;
};

export const getCategories = async()=>{
  const query = gql`
    query GetCategories(){
      categories {
        name
        slug
      }
    }
  `
  const result = await request(graphqlAPI, query);

  return result.categories;

}

export const getCategoryPost = async (slug) => {
  const query = gql`
    query GetCategoryPost($slug: String!) {
      postsConnection(where: {categories_some: {slug: $slug}}) {
        edges {
          cursor
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.postsConnection.edges;
};


//frontend comunicates with backend(pages/api/comments) trough this function
export const submitComment = async(obj)=>{
  const result = await fetch(`/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  });

  return result.json();
}

export const getComments = async(slug)=>{
  const query = gql`
    query GetComments($slug: String!){
      comments(where: {post: {slug: $slug }}){
        name
        createdAt
        comment
      }
    }
  `

  const result = await request(graphqlAPI, query, {slug})
  return result.comments
}
