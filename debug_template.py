from pathlib import Path
from fastapi.templating import Jinja2Templates

BASE_DIR = Path('app/main.py').resolve().parent
print('BASE_DIR', BASE_DIR)
print('templates dir', BASE_DIR / 'templates')

templates = Jinja2Templates(directory=str(BASE_DIR / 'templates'))
print('templates obj', templates)

class DummyRequest:
    pass

request = DummyRequest()

try:
    response = templates.TemplateResponse('index.html', {'request': request})
    print('Success', response)
except Exception as e:
    import traceback
    traceback.print_exc()
