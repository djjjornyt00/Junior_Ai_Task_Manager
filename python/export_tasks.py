import csv
import os
import sys
import psycopg2
from dotenv import load_dotenv

# Загружаем переменные окружения из файла .env
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

OUTPUT_FILE = "tasks.csv"


def get_connection():
    """Создаёт подключение к PostgreSQL."""
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )


def fetch_tasks(connection):
    """Получает все задачи из таблицы tasks."""
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT id, title, description, status, created_at FROM tasks ORDER BY id"
        )
        rows = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]
    return column_names, rows


def write_csv(column_names, rows, output_file):
    """Записывает задачи в CSV-файл."""
    with open(output_file, mode="w", newline="", encoding="utf-8-sig") as file:
        writer = csv.writer(file)
        writer.writerow(column_names)
        writer.writerows(rows)


def main():
    try:
        connection = get_connection()
    except psycopg2.OperationalError as error:
        print(f"Не удалось подключиться к базе данных: {error}")
        sys.exit(1)

    try:
        column_names, rows = fetch_tasks(connection)
        write_csv(column_names, rows, OUTPUT_FILE)
        print(f"Экспортировано задач: {len(rows)}")
        print(f"Файл сохранён: {OUTPUT_FILE}")
    except Exception as error:
        print(f"Ошибка при экспорте: {error}")
        sys.exit(1)
    finally:
        connection.close()


if __name__ == "__main__":
    main()