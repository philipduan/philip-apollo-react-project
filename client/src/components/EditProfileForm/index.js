import { Box, Button, Form, FormField, Text, TextInput } from "grommet";
import { useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";

import { GET_VIEWER } from "../../graphql/queries";
import { UPDATE_PROFILE } from "../../graphql/mutations";
import CharacterCountLabel from "../CharacterCountLabel";
import Loader from "../Loader";
import RequiredLabel from "../RequiredLabel";

const EditProfileForm = ({ profileData, updateViewer }) => {
  const { description, fullName, username } = profileData;

  const [descCharCount, setDescCharCount] = useState(
    (description && description.length) || 0
  );
  const [usernameField, setUsernameField] = useState(username || "");
  const [fullNameField, setFullNameField] = useState(fullName || "");
  const [descriptionField, setDescriptionField] = useState(description || "");
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [updateProfile, { error, loading }] = useMutation(UPDATE_PROFILE, {
    udpate: (cache, { data: { updateProfile } }) => {
      const { viewer } = cache.readQuery({ query: GET_VIEWER });
      const viewerWithProfile = { ...viewer, profile: updateProfile };
      cache.writeQuery({
        query: GET_VIEWER,
        data: { viewer: viewerWithProfile },
      });
      updateViewer(viewerWithProfile);
    },
    onCompleted: () => {
      setShowSaveMessage(true);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <Form
      messages={{ required: "Required" }}
      onSubmit={(event) => {
        updateProfile({
          variables: {
            data: { ...event.value },
            where: { username },
          },
        }).catch((err) => {
          console.error(err);
        });
      }}
      errors={{
        username:
          error &&
          error.message.includes("duplicate key") &&
          "Username is already in use",
      }}
    >
      <FormField
        htmlFor="username"
        id="username"
        label={<RequiredLabel>Username</RequiredLabel>}
        name="username"
        placeholder="Pick a unique username"
        required
        validate={(fieldData) => {
          if (!/^[A-Za-z\d_]*$/.test(fieldData)) {
            return "Alphanumeric characters only (use underscores for whitespace)";
          }
        }}
      >
        <TextInput
          id="username"
          name="username"
          value={usernameField}
          onChange={(event) => setUsernameField(event.target.value)}
        />
      </FormField>
      <FormField
        htmlFor="fullName"
        id="fullName"
        label="Full Name"
        name="fullName"
        placeholder="Add your full name"
      >
        <TextInput
          id="fullName"
          name="fullName"
          value={fullNameField}
          onChange={(event) => setFullNameField(event.target.value)}
        />
      </FormField>
      <FormField
        htmlFor="description"
        id="description"
        label={
          <CharacterCountLabel
            currentChars={descCharCount}
            label="Description"
            max={256}
          />
        }
        name="description"
        placeholder="Write short bio or description about yourself"
        validate={(fieldData) => {
          if (fieldData && fieldData.length > 256) {
            return "256 maximum character count exceeded";
          }
        }}
      >
        <TextInput
          id="description"
          name="description"
          value={descriptionField}
          onChange={(event) => {
            setDescCharCount(event.target.value.length);
            setDescriptionField(event.target.value);
          }}
        />
      </FormField>
      <Box align="center" direction="row" justify="end">
        {loading && <Loader size="medium" />}
        {showSaveMessage && <Text as="p">Changes Saved!</Text>}
        <Button
          disabled={loading}
          label="Save Profile"
          margin={{ left: "xsmall" }}
          primary
          type="submit"
        />
      </Box>
    </Form>
  );
};

export default EditProfileForm;
