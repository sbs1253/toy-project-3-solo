import { get, increment, ref, update } from 'firebase/database';
import { db } from '@src/firebase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserType } from '@store/types';
import { useUserStore } from '@store/useUserStore';
interface LikeDislikeDataParams {
  userId: string;
  playlistId: string;
  action: 'like' | 'dislike';
  currentState: boolean;
}

const updateLikeDislike = async ({ userId, playlistId, action, currentState }: LikeDislikeDataParams) => {
  const userRef = ref(db, `users/${userId}`);
  const playlistAction = `${action}s`;
  const userAction = action === 'like' ? 'likedPlaylists' : 'dislikedPlaylists';
  const updates: { [key: string]: unknown } = {
    [`users/${userId}/${userAction}/${playlistId}`]: !currentState,
    [`playlists/${playlistId}/${playlistAction}`]: increment(currentState ? -1 : 1),
  };
  if (action === 'like') {
    updates[`users/${userId}/likedPlaylists/${playlistId}`] = !currentState;
    updates[`playlists/${playlistId}/${action}s`] = increment(currentState ? -1 : 1);
  } else {
    updates[`users/${userId}/dislikedPlaylists/${playlistId}`] = !currentState;
    updates[`playlists/${playlistId}/${action}s`] = increment(currentState ? -1 : 1);
  }
  await update(ref(db), updates);
  const userSnapshot = await get(userRef);
  return {
    user: userSnapshot.val() as UserType,
  };
};

// 좋아요 싫어요 업데이트
export const useLikeDislikeQuery = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.actions.setUser);
  return useMutation({
    mutationFn: updateLikeDislike,
    onSuccess: ({ user }, { userId, playlistId }) => {
      setUser(user);
      queryClient.setQueryData(['user', userId], user);
      queryClient.invalidateQueries({ queryKey: ['playlists', playlistId] });
    },
    onError: (error) => {
      console.error('Failed to update like/dislike:', error);
    },
  });
};
