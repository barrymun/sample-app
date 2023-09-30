import { gql } from "@apollo/client";

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    data: users(where: { email: { _eq: $email } }) {
      email
    }
  }
`;
