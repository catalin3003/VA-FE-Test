import { Suspense } from 'react';
import SearchResultsComponent from '../components/search-results/search-results.component'
import Loading from './loading';

export default function Results({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <SearchResultsComponent searchParams={searchParams} />
      </Suspense>
    </>
  )
}
