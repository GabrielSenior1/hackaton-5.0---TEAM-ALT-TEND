import sys
import os

# Add root path to Python path so absolute imports in main.py work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
