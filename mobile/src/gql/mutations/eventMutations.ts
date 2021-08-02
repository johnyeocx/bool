import { gql } from "@apollo/client";

export const CHANGE_DISPLAY = gql`
  mutation ChangeDisplay($input: ChangeDisplay!) {
    changeDisplay(input: $input)
  }
`;

export const CHANGE_DETAILS = gql`
  mutation ChangeDetails($input: ChangeDetails!) {
    changeDetails(input: $input)
  }
`;

export const GET_DISPLAY_URL = gql`
  mutation GetDisplayUrl($input: String!) {
    getDisplayUrl(input: $input)
  }
`;
