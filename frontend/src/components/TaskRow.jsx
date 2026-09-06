function TaskRow({ task, onStatusChange, onDelete }) {
  return (
    <tr>
      <td>{task.id}</td>
      <td>{task.title}</td>
      <td>{task.description}</td>
      <td>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="new">new</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
      </td>
      <td>
        <button onClick={() => onDelete(task.id)}>Удалить</button>
      </td>
    </tr>
  );
}

export default TaskRow;