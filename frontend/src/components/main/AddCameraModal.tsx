import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

interface AddCameraModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}
interface AddCameraModalContentProps {
  onSubmit: (url: string) => void;
}
export function AddCameraModalContent(props: AddCameraModalContentProps) {
  const [url, setUrl] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit( url);
      }}
    >
      <Stack>
        <TextInput
          name="URL Kamera"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="RTSP URL"
        />
        <Button type="submit">Simpan</Button>
      </Stack>
    </form>
  );
}

export function AddCameraModal(props: AddCameraModalProps) {
  return (
    <Modal title="Tambah Kamera" opened={props.opened} onClose={props.onClose}>
      <AddCameraModalContent
        onSubmit={(url) => {
          props.onSubmit(url);
          modals.closeAll();
        }}
      />
    </Modal>
  );
}
// export const AddCameraModal.Content: JSX.Element= AddCameraModalContent
