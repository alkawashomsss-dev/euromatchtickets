web: cd backend && gunicorn server:app -w 1 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001 --timeout 120 --graceful-timeout 60 --keep-alive 5
