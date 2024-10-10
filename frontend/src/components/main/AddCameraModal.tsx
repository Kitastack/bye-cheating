import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

interface AddCameraModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (name: string, url: string) => void;
}
interface AddCameraModalContentProps {
  onSubmit: (name: string, url: string) => void;
}
export function AddCameraModalContent(props: AddCameraModalContentProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(name, url);
      }}
    >
      <Stack>
        <TextInput
          name="Nama Kamera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tambahkan nama kamera"
        />
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
        onSubmit={(name,url) => {
          props.onSubmit(name, url);
          modals.closeAll();
          
        }}
      />
    </Modal>
  );
}
// export const AddCameraModal.Content: JSX.Element= AddCameraModalContent
