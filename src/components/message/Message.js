import React, { createElement, useState } from "react";
import { Comment, Tooltip, Avatar } from "antd";
import moment from "moment";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";

const Message = (props) => {
  let [likes, setLikes] = useState(props.likes.length);
  let [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction("liked");
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction("disliked");
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(
          action === "disliked" ? DislikeFilled : DislikeOutlined
        )}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span key="comment-basic-reply-to">Reply to</span>,
  ];

  return (
    <li className="Message">
      <Comment
        actions={actions}
        author={props.username}
        avatar={<Avatar src="" alt={props.username} />}
        content={<div className="message-text">{props.text}</div>}
        datetime={
          <Tooltip
            title={moment(props.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          >
            <span>{moment(props.createdAt).fromNow()}</span>
          </Tooltip>
        }
      />
    </li>
  );
};

export default Message;
