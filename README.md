# spare-hub
SpareHub – Online Tractor Parts Store SpareHub is a modern e-commerce platform for selling tractor spare parts online. It provides farmers and businesses with an easy way to browse, search, and order high-quality parts. The project focuses on simplicity, fast search, and clear categorization, making it convenient to find exactly what you need.


## Installation

Install project dependencies from `requirements.txt`:

```bash
# (Optional) create and activate a virtual environment
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows (PowerShell)
# .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

## Code style and pre-commit

This repository enforces consistent code style and best practices using Black (formatter), Ruff (linter and import sorter), and pre-commit hooks.

### One-time setup
```bash
pip install pre-commit
pre-commit install
```

### Run checks and auto-fixes locally
```bash
# Run all hooks on all files
pre-commit run --all-files

# Or run specific tools directly
black .
ruff check --fix .
```

Conventions enforced:
- Double quotes for strings where possible (Ruff Q rules)
- Imports sorted consistently (Ruff isort)
- Trailing whitespace trimmed and a newline at end of file
- Line length formatted by Black at 88; Ruff E501 (line-too-long) is ignored to allow long constants/URLs
- Black-compatible formatting and various lint checks
