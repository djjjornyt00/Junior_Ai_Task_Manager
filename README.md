# AI Task Manager

Учебный проект: простой Task Manager для управления задачами. Позволяет создавать, просматривать, изменять статус и удалять задачи через веб-интерфейс.

## Стек технологий

- **Frontend:** React (JavaScript) + Vite
- **Backend:** Node.js + Express
- **База данных:** PostgreSQL
- **Дополнительно:** Python (экспорт данных в CSV)

## Структура проекта

```
task-manager/
├── backend/
│   ├── controllers/
│   │   └── tasksController.js
│   ├── routes/
│   │   └── tasksRoutes.js
│   ├── db/
│   │   └── pool.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskTable.jsx
│   │   │   └── TaskRow.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── python/
│   ├── export_tasks.py
│   ├── requirements.txt
│   └── .env.example
│
├── database.sql
├── .gitignore
└── README.md
```

## Требования для запуска

- Node.js (версия 18 или выше)
- PostgreSQL (версия 14 или выше)
- Python (версия 3.10 или выше)

## Установка PostgreSQL

Скачать и установить PostgreSQL можно с официального сайта: https://www.postgresql.org/download/

После установки убедиться, что сервер PostgreSQL запущен (обычно запускается автоматически как служба).

## Создание базы данных

Открыть терминал и подключиться к PostgreSQL:

```bash
psql -U postgres
```

Создать базу данных:

```sql
CREATE DATABASE task_manager;
```

Выйти из psql:

```sql
\q
```

## Выполнение database.sql

Из корня проекта выполнить:

```bash
psql -U postgres -d task_manager -f database.sql
```

Проверить, что таблица создалась:

```bash
psql -U postgres -d task_manager -c "\d tasks"
```

## Настройка .env

### Backend

Скопировать пример файла:

```bash
cd backend
cp .env.example .env
```

Открыть `.env` и вписать свои настройки:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=1111
PORT=5000
```

### Python

Аналогично создать `.env` в папке `python/` с теми же данными для подключения к базе:

```bash
cd python
cp .env.example .env
```

## Запуск Backend

```bash
cd backend
npm install
npm run dev
```

Backend запустится на `http://localhost:5000`.

Проверить, что всё работает:

```bash
curl http://localhost:5000/tasks
```

Ожидаемый результат: `[]` (пустой массив, если задач ещё нет).

## Запуск Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend запустится на `http://localhost:5173`. Открыть этот адрес в браузере.

**Важно:** backend должен быть запущен параллельно, иначе фронтенд не сможет загрузить задачи.

## Запуск Python-скрипта

```bash
cd python
pip install -r requirements.txt
python export_tasks.py
```

После выполнения в папке `python/` появится файл `tasks.csv` со всеми задачами из базы данных.

## Описание API

| Метод | Путь | Описание |
|---|---|---|
| GET | /tasks | Получить список всех задач |
| POST | /tasks | Создать новую задачу |
| PUT | /tasks/:id | Изменить статус задачи |
| DELETE | /tasks/:id | Удалить задачу |

### Коды ответов

| Код | Когда возвращается |
|---|---|
| 200 | Успешное получение / изменение / удаление |
| 201 | Задача успешно создана |
| 400 | Некорректные данные в запросе |
| 404 | Задача с указанным id не найдена |
| 500 | Внутренняя ошибка сервера |

## Примеры API-запросов

### Создать задачу

```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Изучить React","description":"Пройти базовый курс"}'
```

Ответ:

```json
{
  "id": 1,
  "title": "Изучить React",
  "description": "Пройти базовый курс",
  "status": "new",
  "created_at": "2026-09-06T10:15:23.123Z"
}
```

### Получить все задачи

```bash
curl http://localhost:5000/tasks
```

### Изменить статус задачи

```bash
curl -X PUT http://localhost:5000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

### Удалить задачу

```bash
curl -X DELETE http://localhost:5000/tasks/1
```

## Пример CSV после экспорта

```
id,title,description,status,created_at
1,Изучить React,Пройти базовый курс,done,2026-09-06 10:15:23.123456
2,Сходить в магазин,Большая закупка на неделю,in_progress,2026-09-06 10:16:01.654321
```

## Возможные ошибки и их решение

| Ошибка | Причина | Решение |
|---|---|---|
| `Unexpected token '<'... is not valid JSON` | Frontend стучится не на тот порт backend, либо backend не запущен | Проверить `API_URL` в `frontend/src/api.js` и порт в `backend/.env` — они должны совпадать |
| `ModuleNotFoundError: No module named 'psycopg2'` | Библиотека не установлена в текущее окружение Python | Выполнить `pip install -r requirements.txt` |
| Ошибка сборки `psycopg2-binary` (нужен Visual C++) | Версия пакета несовместима с версией Python | Убрать фиксацию версии в `requirements.txt` или обновить до последней версии `psycopg2-binary` |
| Кракозябры в CSV при открытии в Excel | Excel по умолчанию не распознаёт UTF-8 без BOM | В `export_tasks.py` использовать `encoding="utf-8-sig"` вместо `"utf-8"` |
| CSV открывается одной колонкой в Excel | Региональные настройки Excel используют `;` как разделитель | Импортировать через **Данные → Из текста/CSV** и указать запятую как разделитель |
| `ECONNREFUSED` при запросах к backend | PostgreSQL не запущен или неверные данные в `.env` | Проверить, что служба PostgreSQL запущена, сверить `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` |
| Ошибка CORS в консоли браузера | Backend не разрешает запросы с адреса фронтенда | Убедиться, что в `app.js` подключён `app.use(cors())` |

## Автор Ядрышникова Варвара Алексеевна

Учебный проект, выполнен в рамках практики.
