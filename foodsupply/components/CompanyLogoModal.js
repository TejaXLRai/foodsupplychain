import React from "react";
import { Button, Modal, Image } from "semantic-ui-react";

function CompanyLogoModal(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={
        <img
          id="company_logo"
          alt="company logo"
          src={props.conpanyLogoLink}
          className="ui small left floated image companyLogo"
        />
      }
    >
      <Modal.Header>Company Information</Modal.Header>
      <Modal.Content>
        <Modal.Description>{props.companyInformation}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default CompanyLogoModal;
