from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import analysis
from .schemas import ExpenseIn

app = FastAPI(title="Expense Analytics")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your Vite dev server
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.post("/analyze")
def analyze(expenses: list[ExpenseIn]):
    df = analysis.to_frame(expenses)
    return {
        "monthly": analysis.monthly_summary(df),
        "categories": analysis.category_breakdown(df),
        "anomalies": analysis.anomalies(df),
    }