import { render } from "react-dom";
import React, { useState } from "react";
import { EditingState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn
} from "@devexpress/dx-react-grid-material-ui";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

import { rows as dataRows } from "./data";

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: "center" }}>
    <Button color="primary" onClick={onExecute} title="Create new row">
      New
    </Button>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute, disabled }) => {
  console.log(onExecute);

  return (
    <IconButton onClick={onExecute} title="Save changes" disabled={disabled}>
      <SaveIcon />
    </IconButton>
  );
};

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
};

const Command = ({ id, onExecute }) => {
  console.log(id);
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} disabled={true} />;
};

const getRowId = row => row.id;

const App = () => {
  const [columns] = useState([
    { name: "name", title: "Name" },
    { name: "sex", title: "Sex" },
    { name: "city", title: "City" },
    { name: "car", title: "Car" }
  ]);
  const [rows, setRows] = useState(
    dataRows.map((row, index) => ({ ...row, id: index }))
  );

  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;
    if (added) {
      const startingAddedId =
        rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row
        }))
      ];
    }
    if (changed) {
      changedRows = rows.map(row =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
    }
    setRows(changedRows);
  };

  return (
    <Paper>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <EditingState onCommitChanges={commitChanges} />
        <Table />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          commandComponent={Command}
        />
      </Grid>
    </Paper>
  );
};

render(<App />, document.getElementById("root"));
