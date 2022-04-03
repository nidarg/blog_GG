// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import {GraphQLClient, gql} from 'graphql-request'

// const graphqlAPI = process.env.NEXT_GRAPHCMS_ENDPOINT
// const graphcmsToken = process.env.GRAPHCMS_TOKEN

// //our backend(/page/api/comments) comunicate with graphCMS('database') 
// export default async function comments(req, res) {

//   //const{name, email, slug, comment} = req.body

//   const graphQLClient = new GraphQLClient(graphqlAPI,{
//     headers:{
//       authorization:`Bearer ${graphcmsToken}`
//     }
//   })

//   // mutation is used when add/update data to/from graphCMS 
//   const query = gql `
//     mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug{
//       createComment(data:{name:$name, email:$email, comment:$comment, post:{connect: {slug: $slug}}}){id}
//     }
//   `
//   try {
//     const result = await graphQLClient.request(query,{
//       name: req.body.name,
//       email: req.body.email,
//       comment: req.body.comment,
//       slug: req.body.slug,
//     })

//   return res.status(200).send(result)

//   } catch (error) {
//     console.log(error)
//     return res.status(500).send(error)
//   }
  
// }


import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

/** *************************************************************
* Any file inside the folder pages/api is mapped to /api/* and  *
* will be treated as an API endpoint instead of a page.         *
*************************************************************** */

// export a default function for API route to work
export default async function asynchandler(req, res) {
  const graphQLClient = new GraphQLClient((graphqlAPI), {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
    },
  });

  const query = gql`
    mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
      createComment(data: {name: $name, email: $email, comment: $comment, post: {connect: {slug: $slug}}}) { id }
    }
  `;

  const result = await graphQLClient.request(query, {
    name: req.body.name,
    email: req.body.email,
    comment: req.body.comment,
    slug: req.body.slug,
  });

  return res.status(200).send(result);
}