import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";

interface AddCameraModalProps {
  opened: boolean;
  onClose: () => void;
}
interface AddCameraModalContentProps {
  onSubmit: () => void;
}
export function AddCameraModalContent(props: AddCameraModalContentProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
    >
      <Stack>
        <TextInput name="URL Kamera" placeholder="RTSP URL" />
        <Button type="submit">Simpan</Button>
      </Stack>
    </form>
  );
}

export function AddCameraModal(props: AddCameraModalProps) {
  return (
    <Modal title="Tambah Kamera" opened={props.opened} onClose={props.onClose}>
      <AddCameraModalContent onSubmit={() => modals.closeAll()} />
    </Modal>
  );
}
// export const AddCameraModal.Content: JSX.Element= AddCameraModalContent
