import { useSession } from "next-auth/react";
import Paper from "@mui/material/Paper";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { PickerOverlay } from "filestack-react";
import FilePreviewer from "react-file-previewer";

const paper = {
  p: "15px",
  my: "10px",
  backgroundColor: "lightwhite",
};

const style1 = {
  display: "flex",
  "&:hover": {
    cursor: "pointer",
  },
  h6: {
    width: "100%",
    color: "text.secondary",
    display: "flex",
    alignItems: "center",
    pl: "20px",
    "&:hover": {
      color: "blue",
    },
  },
};

const style2 = {
  p: "20px",
  width: "100%",
  ".MuiTextField-root": {
    width: "100%",
  },
  ".buttons": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mt: "10px",
  },
};

function Paper1({ image, openInput }) {
  return (
    <Box sx={style1} onClick={openInput}>
      <Avatar src={image} alt="user" />
      <Typography component="h6">Announce something to your class</Typography>
    </Box>
  );
}

export default function AnnouncementInput({ classId }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pick, setPick] = useState(false);

  const openInput = () => setOpen(true);
  const closeInput = () => setOpen(false);

  const openPick = () => setPick(true);
  const closePick = () => setPick(false);

  const handleUpload = () => {
    console.log(urls);
  };

  const handleTextChange = (e) => setText(e.target.value);

  const onUploadDone = (files) => {
    console.log(files);
    files.filesUploaded.forEach((file) => {
      setUrls([...urls, file.url]);
    });
  };
  const onUploadError = (err) => {
    console.log(err);
  };

  const pickerOptions = {
    accept: [".pdf", "image/*", "video/*", "audio/*", "text/*"],
    disableThumbnails: false,
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
    onClose: closePick,
  };

  const apiKey = process.env.NEXT_PUBLIC_FILESTACK_API_KEY;

  if (!session) return <p>loading</p>;
  return (
    <Paper sx={paper} elevaion={3}>
      {!open && <Paper1 image={session.user.image} openInput={openInput} />}
      {open && (
        <Box sx={style2}>
          <TextField onChange={handleTextChange} label="Type something" />
          {pick && (
            <PickerOverlay
              apikey={apiKey}
              onUploadDone={onUploadDone}
              onError={onUploadError}
              pickerOptions={pickerOptions}
            />
          )}
          <Box className="buttons">
            <Button onClick={openPick}>Upload Files</Button>
            <Box>
              <Button sx={{ m: "5px" }} variant="outlined" onClick={closeInput}>
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                sx={{ m: "5px" }}
                variant="contained"
                onClick={handleUpload}
              >
                Post
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
