import styled from "styled-components";

export const EmptyToolbar = styled.div`
  ${({ theme }) => `
display: flex;
align-items: center;
justify-content: flex-end;
padding: ${theme.spacing(0, 1)}px;
min-height: 56px;
@media (min-width:0px) and (orientation: landscape) {
  min-height: 48px;
}
@media (min-width:600px) {
  min-height: 64px;
}
`}
`;
