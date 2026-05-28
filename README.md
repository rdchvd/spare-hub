# Spare Hub
Spare Hub is an online marketplace for tractor parts and agronomy supplies. It helps farmers and agribusiness teams browse listings, compare options, and order trusted parts with clear categories and fast search.


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

Install frontend dependencies:

```bash
npm install
```

## Run frontend + backend for development

From the repository root, run:

```bash
npm run dev:full
```

This starts:
- frontend (Vite) on your local dev port (shown in terminal)
- backend (Django) on `http://localhost:8000`

If you want to run only one side:

```bash
npm run dev      # frontend only
npm run dev:be   # backend only
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
