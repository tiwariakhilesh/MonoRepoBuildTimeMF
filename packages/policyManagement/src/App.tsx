import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
type TableItemsState = {
  id: number;
  name: string;
  email: string;
}

export const PolicyManagement = () => {
  const [data, setData] = useState<TableItemsState[]>([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    // Simulate fetching data from an API
    const initialData = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    ];
    setData(initialData);
  }, []);

  const handleCreate = () => {
    setFormData({ id: '', name: '', email: '' });
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleRead = (id) => {
    const item = data.find((item) => item.id === id);
    setFormData(item);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleUpdate = (id) => {
    const item = data.find((item) => item.id === id);
    setFormData(item);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const handleSave = () => {
    if (selectedItem) {
      // Update existing item
      const updatedData = data.map((item) =>
        item.id === formData.id ? formData : item
      );
      setData(updatedData);
    } else {
      // Create new item
      const newItem = { ...formData, id: data.length + 1 };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleCreate} style={{ margin: "30px" }}>
        Create
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleRead(item.id)}>
                    Read
                  </Button>
                  <Button color="secondary" onClick={() => handleUpdate(item.id)}>
                    Update
                  </Button>
                  <Button color="error" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{selectedItem ? 'Edit Item' : 'Create New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            name="id"
            value={formData.id}
            disabled
            margin="dense"
            fullWidth
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="dense"
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="dense"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
