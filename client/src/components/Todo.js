import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const result = await axios.get('http://127.0.0.1:5000/getTodoList', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTodoList(result.data);
                } catch (err) {
                    console.log('Failed to fetch tasks:', err);
                    if (err.response && err.response.status === 401) {
                        // Handle unauthorized access
                        localStorage.removeItem('token');
                        window.location.href = '/login'; // Redirect to login
                    }
                }
            } else {
                window.location.href = '/login'; // Redirect to login if no token
            }
        };

        fetchTasks();
    }, []);

    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post('http://127.0.0.1:5000/addTodoList', 
                { task: newTask, status: newStatus, deadline: newDeadline }, 
                { headers: { Authorization: `Bearer ${token}` } });
                
                setNewTask("");
                setNewStatus("");
                setNewDeadline("");
                // Fetch updated tasks
                const result = await axios.get('http://127.0.0.1:5000/getTodoList', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTodoList(result.data);
            } catch (err) {
                console.log('Failed to add task:', err);
            }
        }
    };

    const saveEditedTask = async (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post(`http://127.0.0.1:5000/updateTodoList/${id}`, editedData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline("");
                // Fetch updated tasks
                const result = await axios.get('http://127.0.0.1:5000/getTodoList', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTodoList(result.data);
            } catch (err) {
                console.log('Failed to save task:', err);
            }
        }
    };

    const deleteTask = async (id) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.delete(`http://127.0.0.1:5000/deleteTodoList/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Fetch updated tasks
                const result = await axios.get('http://127.0.0.1:5000/getTodoList', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTodoList(result.data);
            } catch (err) {
                console.log('Failed to delete task:', err);
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <h2 className="text-center">Todo List</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {Array.isArray(todoList) ? (
                                <tbody>
                                    {todoList.map((data) => (
                                        <tr key={data._id}>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedTask}
                                                        onChange={(e) => setEditedTask(e.target.value)}
                                                    />
                                                ) : (
                                                    data.task
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedStatus}
                                                        onChange={(e) => setEditedStatus(e.target.value)}
                                                    />
                                                ) : (
                                                    data.status
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        value={editedDeadline}
                                                        onChange={(e) => setEditedDeadline(e.target.value)}
                                                    />
                                                ) : (
                                                    data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <button className="btn btn-success btn-sm" onClick={() => saveEditedTask(data._id)}>
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-primary btn-sm" onClick={() => toggleEditable(data._id)}>
                                                        Edit
                                                    </button>
                                                )}
                                                <button className="btn btn-danger btn-sm ml-1" onClick={() => deleteTask(data._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan="4">Loading tasks...</td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
                <div className="col-md-5">
                    <h2 className="text-center">Add Task</h2>
                    <form className="bg-light p-4" onSubmit={addTask}>
                        <div className="mb-3">
                            <label>Task</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Task"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Status"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Deadline</label>
                            <input
                                className="form-control"
                                type="datetime-local"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success btn-sm">
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Todo;
