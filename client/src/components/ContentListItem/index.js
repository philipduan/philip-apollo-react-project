import { Anchor, Box, Image, Text } from "grommet";
import { Link } from "react-router-dom";
import React from "react";

import { displayRelativeDateorTime } from "../../lib/displayDatetime";
import { useAuth } from "../../context/AuthContext";
import NotAvailableMessage from "../NotAvailableMessage";

const ContentListItem = ({ contentData }) => {
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  const {
    author,
    createdAt,
    isBlocked,
    postAuthor: parentPostAuthor,
    text,
  } = contentData;

  return (
    <Box
      border={{
        color: "light-4",
        size: "xsmall",
        style: "solid",
        side: "bottom",
      }}
      direction="row"
      pad={{ left: "small", top: "medium", right: "small" }}
    >
      <Box
        height="48px"
        margin={{ right: "medium" }}
        overflow="hidden"
        round="full"
        width="48px"
      >
        <Image
          fit="cover"
          src={author.avatar}
          alt={`${author.fullName} profile image`}
        />
      </Box>
      <Box flex margin={{ bottom: "medium" }}>
        <Text as="p">
          <Text weight="bold">{author.fullName}</Text>{" "}
          <Link to={`/profile/${author.username}`}>
            <Anchor color="dark-4" as="span">
              @{author.username}
            </Anchor>
          </Link>
        </Text>
        {parentPostAuthor && (
          <Text as="p">
            <Text color="dark-3">Replying to</Text>
            <Link to={`/profile/${parentPostAuthor.username}`}>
              <Anchor as="span">@{parentPostAuthor.username}</Anchor>
            </Link>
          </Text>
        )}
        {parentPostAuthor === null && (
          <NotAvailableMessage
            margin={{ top: "xsmall" }}
            text="This reply's parent author no longer exists"
          />
        )}
        {isBlocked && (
          <NotAvailableMessage
            margin="small"
            text="This content was blocked by a moderator"
          />
        )}
        {(!isBlocked || author.username === username) && (
          <Text as="p" margin={{ top: "small" }}>
            {text}
          </Text>
        )}
        <Box align="center" direction="row" margin={{ top: "small" }}>
          <Text as="p" color="dark-3" size="small">
            {displayRelativeDateorTime(createdAt)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ContentListItem;
