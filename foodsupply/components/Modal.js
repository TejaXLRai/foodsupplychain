import React from "react";
import { Button, Modal } from "semantic-ui-react";

function ModalBox(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<p className={props.className}>{props.tagName}</p>}
    >
      <Modal.Header>
        Tag Information :
        <span style={{ textTransform: "capitalize" }}>{props.tagName}</span>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>{props.tagInformation}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
}
export default ModalBox;
