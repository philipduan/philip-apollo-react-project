export function updateSubfieldPageResults(
  field,
  subfield,
  fetchMoreResult,
  previousResult
) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field][subfield];

  return newEdges.lenght
    ? {
        [field]: {
          ...previousResult[field],
          [subfield]: {
            __typename: previousResult[field][subfield].__typename,
            edges: [...previousResult[field][subfield].edges, ...newEdges],
            pageInfo,
          },
        },
      }
    : previousResult;
}
