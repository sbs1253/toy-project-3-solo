import Category from '@pages/Home/components/Category';
import PlayList from '@components/PlayList';
import styled from 'styled-components';
import LoadingCircular from '@components/LoadingCircular';
import NotFound from '@pages/NotFound';
import { useAllPlaylistsQuery } from '@hooks/query/usePlaylistsQuery';
import { useSearchParams } from 'react-router-dom';
const Home = () => {
  const [query] = useSearchParams();
  const category = query.get('category') ?? 'all';
  const { data, isLoading, isError, error } = useAllPlaylistsQuery(category);

  if (isLoading) return <LoadingCircular />;
  if (isError) return <NotFound messege={error?.message || 'Not Found'} />;

  return (
    <HomeContainer>
      <Category />
      {data?.map((playlistId) => (
        <PlayList key={playlistId} playlistId={playlistId} />
      ))}
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: calc(100% - 151px);

  overflow-y: auto;
`;
