import { ReactNode } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import Heading from 'components/Form/Heading';

export interface RowProps {
  lbl: string,
  val: string,
  // key?: string,
  children?: ReactNode,
  rowList?: RowProps[],
  title?: string,
}

export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primary}; }
  span.lbl { font-weight: bold; }
  span.val {
    max-width: 16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }  
`;

const StyledExpandableRow = styled(StyledRow).attrs({
  as: "summary"
})``;

const Details = styled.details`
  transition: all 0.2s ease-in-out;
  summary {
    padding-left: 1rem;
  }
  summary:before {
    content: "►";
    position: absolute;
    margin-left: -1rem;
    color: ${colors.primary};
    cursor: pointer;
  }
  &[open] summary:before {
    content: "▼";
  }
`;

const SubRowList = styled.ul`
  margin: 0;
  padding: 0.25rem;
  background: ${colors.primaryTransparent};
`;

const SubRow = styled(StyledRow).attrs({
  as: "li"
})`
  border-bottom: 1px dashed ${colors.primaryTransparent} !important;
`;

const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(dateString));
}

const formatValue = (value: any): string => {
  const isValidDate = (date: any) => date instanceof Date && !isNaN(date as any as number);
  if (isValidDate(new Date(value))) return formatDate(value);
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  return value;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}

export const ExpandableRow = (props: RowProps) => {
  const { lbl, val, title, rowList } = props;
  return (
    <Details>
      <StyledExpandableRow key={`${lbl}-${val}`}>
        <span className="lbl" title={title}>{lbl}</span>
        <span className="val" title={val}>{val}</span>
      </StyledExpandableRow>
      { rowList &&
        <SubRowList>
          { rowList?.map((row: RowProps, index: number) => {
            return (
              <SubRow key={`${row.lbl}-${index}`}>
                <span className="lbl" title={row.title}>{row.lbl}</span>
                <span className="val" title={row.val} onClick={() => copyToClipboard(row.val)}>
                  {formatValue(row.val)}
                </span>
              </SubRow>
            )
          })}
        </SubRowList>
      }
    </Details>
  );
};

export const ListRow = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    <Heading as="h4" size="small" align="left" color={colors.primary}>{title}</Heading>
    { list.map((entry: string, index: number) => {
      return (
      <Row lbl="" val="" key={`${entry}-${title.toLocaleLowerCase()}-${index}`}>
        <span>{ entry }</span>
      </Row>
      )}
    )}
  </>
);
}

const Row = (props: RowProps) => {
  const { lbl, val, title, children } = props;
  if (children) return <StyledRow key={`${lbl}-${val}`}>{children}</StyledRow>;
  return (
  <StyledRow key={`${lbl}-${val}`}>
    { lbl && <span className="lbl" title={title}>{lbl}</span> }
    <span className="val" title={val} onClick={() => copyToClipboard(val)}>
      {formatValue(val)}
    </span>
  </StyledRow>
  );
};

export default Row;
