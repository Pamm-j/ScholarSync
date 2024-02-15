.PHONY: frontend backend lbe lfe

frontend:
	@echo "Starting the frontend server..."
	@cd frontend && npm start

backend:
	@echo "Activating virtual environment and starting Django server..."
	@cd backend && . myvenv/bin/activate && python manage.py runserver

lbe:
	@echo "Linting backend..."
	@cd backend && source myvenv/bin/activate &&  pylint *.py

lfe:
	@echo "Linting frontend..."
	@cd frontend && npm run format

lint: lfe lbe