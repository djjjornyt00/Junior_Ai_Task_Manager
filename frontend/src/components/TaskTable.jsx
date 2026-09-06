import TaskRow from './TaskRow';

function TaskTable({ tasks, onStatusChange, onDelete }) {
  if (tasks.length === 0) {
    return <p>Задач пока нет. Создайте первую!</p>;
  }

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Описание</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

export default TaskTable;