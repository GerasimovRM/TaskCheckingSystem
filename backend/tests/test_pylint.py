import os.path
from contextlib import redirect_stdout
import io

import pycodestyle


f2 = os.path.basename(__file__)
print(f2)
fchecker = pycodestyle.Checker( 'test_pylint.py', show_source=True)
f = io.StringIO()  # Dummy file
with redirect_stdout(f):
    file_errors = fchecker.check_all()
out = f.getvalue().splitlines()  # Get list of lines from the dummy file

print(filist(map(lambda x: x.startswith(f2), out)))