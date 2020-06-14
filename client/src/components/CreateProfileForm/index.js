import { Box, Button, Form, FormField, TextInput } from "grommet";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";

import { CREATE_PROFILE } from "../../graphql/mutations";
import CharacterCountLabel from "../CharacterCountLabel";
import Loader from "../Loader";
import RequiredLabel from "../RequiredLabel";
import { GET_VIEWER } from "../../graphql/queries";

const CreateProfileForm = ({ accountId, updateViewer }) => {
  const [descCharCount, setDescCharCount] = useState(0);
  const [usernameField, setUsernameField] = useState("");
  const [fullNameField, setFullNameField] = useState("");
  const [descriptionField, setDescriptionField] = useState("");
  const [createProfile, { error, loading }] = useMutation(CREATE_PROFILE, {
    update: (cache, { data: { createProfile } }) => {
      const { viewer } = cache.readQuery({ query: GET_VIEWER });
      const viewerWithProfile = { ...viewer, profile: createProfile };
      cache.writeQuery({
        query: GET_VIEWER,
        data: { viewer: viewerWithProfile },
      });
      updateViewer(viewerWithProfile);
    },
  });
  return (
    <Form
      messages={{ required: "Required" }}
      onSubmit={(event) => {
        createProfile({
          variables: {
            data: { accountId, ...event.value },
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
        <Button
          disabled={loading}
          label="Create Profile"
          margin={{ left: "xsmall" }}
          primary
          type="submit"
        />
      </Box>
    </Form>
  );
};

export default CreateProfileForm;
