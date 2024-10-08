import { useUserQuery } from '@hooks/query/useUserQuery';
import { CommentType } from 'src/store/types';
import { MoreVertOutlined } from '@mui/icons-material';
import styled from 'styled-components';
import { useToggle } from '@hooks/useToggle';
import { useUserStore } from '@store/useUserStore';
import { useState } from 'react';
import { useCommentUpdateQuery } from '@hooks/query/useCommentUpdateQuery';
import { useCommentDeleteQuery } from '@hooks/query/useCommentDeleteQuery';
import { formatTimestamp } from '@utils/formatTimestamp';

const Comment = ({
  userId,
  comment,
  createdAt,
  playlistId,
  commentId,
}: CommentType & { playlistId: string; commentId: string }) => {
  const { data } = useUserQuery(userId);
  const [toggle, setToggle] = useToggle();
  const [editMode, setEditMode] = useToggle();
  const [newComment, setNewComment] = useState(comment);
  const { mutate: commentUpdateMutate } = useCommentUpdateQuery();
  const { mutate: commentDeleteMutate } = useCommentDeleteQuery();
  const user = useUserStore((state) => state.user);
  if (!data) return null;
  const handleEditClick = () => {
    setEditMode(true);
    setToggle();
  };
  const handleSave = () => {
    const updateComment = { userId, comment: newComment, createdAt: Date.now() };
    commentUpdateMutate({ playlistId, commentId, comment: updateComment });
    setEditMode(false);
  };
  const handleDelete = () => {
    commentDeleteMutate({ playlistId, commentId });
  };
  return (
    <CommentContainer>
      <img src={data.img} alt="profile" />
      <div className="comment__info">
        <div className="comment__title">
          <span>{data.username}</span>
          <span>{formatTimestamp(createdAt)}</span>
        </div>
        {editMode ? (
          <div className="comment__text-edit">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button onClick={handleSave}>저장</button>
          </div>
        ) : (
          <h3 className="comment__text">{comment}</h3>
        )}
      </div>
      {user.id === userId ? (
        <div className="comment__more">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setToggle();
            }}
            className="comment__more-button"
          >
            <MoreVertOutlined className="comment__more-more" />
          </button>
          <div className={`comment__action ${toggle && 'active'}`}>
            <span onClick={handleEditClick}>수정</span>
            <span onClick={handleDelete}>삭제</span>
          </div>
        </div>
      ) : null}
    </CommentContainer>
  );
};

export default Comment;

const CommentContainer = styled.div`
  position: relative;
  display: flex;
  gap: 20px;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.background[3]};

  & img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
  }
  & .comment__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }
  & .comment__title {
    display: flex;
    gap: 20px;
    color: ${(props) => props.theme.colors.text.bodySubtle};
    font-size: var(--font-size-caption);
    line-height: var(--line-height-caption);
    font-size: var(--font-size-caption);
  }
  & .comment__text-edit {
    display: flex;
    justify-content: center;
    align-items: flex-end;

    gap: 10px;
    & textarea {
      padding: 10px;
      border: 1px solid ${(props) => props.theme.colors.stroke[1]};
      border-radius: 5px;
      background-color: ${(props) => props.theme.colors.background[3]};
      color: ${(props) => props.theme.colors.text.body};
    }
    & button {
      height: 30px;
      background-color: ${(props) => props.theme.colors.primary.normal};
      color: ${(props) => props.theme.colors.text.title};
      border: none;
      border-radius: 5px;
      padding: 6px;
      cursor: pointer;
      white-space: nowrap;
    }
  }
  & .comment__more {
    position: absolute;
    top: 10px;
    right: 10px;

    & .comment__more-button {
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: ${(props) => props.theme.colors.primary.normal};
      }
    }
    & .comment__action {
      display: none;
      background-color: ${(props) => props.theme.colors.background[3]};
      border-radius: 5px;
      padding: 10px;
      z-index: 1;
      transition: color 0.3s;

      & span {
        white-space: nowrap;
        cursor: pointer;
        transition: color 0.3s;
        &:hover {
          color: ${(props) => props.theme.colors.primary.normal};
        }
      }
      &.active {
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: absolute;
        top: 30px;
        right: 0;
        color: ${(props) => props.theme.colors.text.body};
      }
    }
  }
`;
